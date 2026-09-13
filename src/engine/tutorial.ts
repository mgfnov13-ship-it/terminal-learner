import type { CommandMeta, UserProgress } from '../types';
import type { AnswerDef, LessonDef, TutorialStep } from '../types/tutorial';
import { FILES_LESSONS, firstLesson as curriculumFirstLesson, isInteractiveKind, lessonById } from '../data/curriculum';
import { COMMANDS } from '../data/commands';
import { FILES_TRACK, type UnitDef, lessonAfter, trackLessons, unitOfLesson } from '../data/tracks';

export function normalizeProgress(raw: Partial<UserProgress> | undefined): UserProgress {
  const p = raw ?? {};
  const lessonId = p.currentLessonId && lessonById(p.currentLessonId) ? p.currentLessonId : firstLesson().id;
  return {
    xp: p.xp ?? 0,
    completedMissionIds: p.completedMissionIds ?? [],
    unlockedAchievementIds: p.unlockedAchievementIds ?? [],
    listedDirectories: Boolean(p.listedDirectories),
    commandCount: p.commandCount ?? 0,
    createdFile: Boolean(p.createdFile),
    createdFolder: Boolean(p.createdFolder),
    copiedFile: Boolean(p.copiedFile),
    deletedItem: Boolean(p.deletedItem),
    currentLessonId: lessonId,
    currentStepIndex: p.currentStepIndex ?? 0,
    completedLessonIds: p.completedLessonIds ?? [],
    completedStepIds: p.completedStepIds ?? [],
    awardedXpKeys: p.awardedXpKeys ?? [],
    hintLevelByStep: p.hintLevelByStep ?? {},
    showedAnswerIds: p.showedAnswerIds ?? [],
    revealedAnswerStepId: p.revealedAnswerStepId ?? null,
    onboardingComplete: p.onboardingComplete ?? ((p.xp ?? 0) > 0),
    academyTab: p.academyTab === 'missions' ? 'missions' : 'learn',
    activeMissionId: p.activeMissionId ?? null,
  };
}

export function firstLesson(): LessonDef {
  return trackLessons(FILES_TRACK)[0] ?? curriculumFirstLesson();
}

export function nextLesson(id: string): LessonDef | undefined {
  return lessonAfter(id, FILES_TRACK);
}

export function activeLesson(progress: UserProgress): LessonDef {
  return lessonById(progress.currentLessonId) ?? firstLesson();
}

export function activeStep(progress: UserProgress): TutorialStep | undefined {
  const lesson = activeLesson(progress);
  return lesson.steps[progress.currentStepIndex];
}

export function isLessonCompleteView(progress: UserProgress): boolean {
  const lesson = activeLesson(progress);
  return progress.currentStepIndex >= lesson.steps.length;
}

export function stepIsSatisfied(progress: UserProgress, stepId?: string): boolean {
  if (!stepId) return false;
  return progress.completedStepIds.includes(stepId);
}

export function isAwaitingTerminal(progress: UserProgress): boolean {
  if (!progress.onboardingComplete) return false;
  const step = activeStep(progress);
  if (!step || !isInteractiveKind(step.kind)) return false;
  return !stepIsSatisfied(progress, step.id);
}

/* ---------------------------------------------------------------- answers */

const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * The answer for a step, wherever it lives. Command steps carry an explicit
 * answer in lesson data; knowledge checks derive theirs from the question so the
 * correct choice is never written down twice.
 */
export function answerForStep(step: TutorialStep | undefined): AnswerDef | undefined {
  if (!step) return undefined;
  if (step.answer) return step.answer;
  if (step.question) {
    const index = step.question.choices.findIndex((c) => c.id === step.question?.correctId);
    const choice = step.question.choices[index];
    if (!choice) return undefined;
    return {
      label: `${CHOICE_LETTERS[index] ?? '?'} — ${choice.label}`,
      explanation: step.question.explanation,
    };
  }
  return undefined;
}

/** Steps the learner has to act on, and which therefore can offer an answer. */
export function stepSupportsAnswer(step: TutorialStep | undefined): boolean {
  if (!step) return false;
  if (!isInteractiveKind(step.kind) && step.kind !== 'question') return false;
  return Boolean(answerForStep(step));
}

export function isAnswerRevealed(progress: UserProgress, step: TutorialStep | undefined): boolean {
  if (!step) return false;
  return progress.revealedAnswerStepId === step.id;
}

/** Did the learner ask for this step's answer at any point? Used for the unaided bonus. */
export function usedAnswerHelp(progress: UserProgress, stepId: string): boolean {
  return progress.showedAnswerIds.includes(stepId);
}

export function hintLevel(progress: UserProgress, step: TutorialStep | undefined): number {
  if (!step) return 0;
  return progress.hintLevelByStep[step.id] ?? 0;
}

/* ------------------------------------------------------- track / units */

export type LessonState = 'complete' | 'current' | 'available' | 'locked';
export type UnitState = 'planned' | 'complete' | 'current' | 'available' | 'locked';

export function filesLessonProgress(progress: UserProgress): { done: number; total: number; percent: number } {
  const lessons = trackLessons(FILES_TRACK);
  const done = lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
  return { done, total: lessons.length, percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function lessonState(lessonId: string, progress: UserProgress): LessonState {
  if (progress.completedLessonIds.includes(lessonId)) return 'complete';
  if (progress.currentLessonId === lessonId) return 'current';
  const lessons = trackLessons(FILES_TRACK);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index <= 0) return 'available';
  const previous = lessons[index - 1];
  return progress.completedLessonIds.includes(previous.id) ? 'available' : 'locked';
}

export function unitState(unit: UnitDef, progress: UserProgress): UnitState {
  if (unit.lessonIds.length === 0) return 'planned';
  const states = unit.lessonIds.map((id) => lessonState(id, progress));
  if (states.every((s) => s === 'complete')) return 'complete';
  if (states.includes('current')) return 'current';
  if (states.includes('available')) return 'available';
  return 'locked';
}

export function unitProgress(unit: UnitDef, progress: UserProgress): { done: number; total: number } {
  return {
    done: unit.lessonIds.filter((id) => progress.completedLessonIds.includes(id)).length,
    total: unit.lessonIds.length,
  };
}

export function currentUnit(progress: UserProgress): UnitDef | undefined {
  return unitOfLesson(progress.currentLessonId, FILES_TRACK) ?? FILES_TRACK.units[0];
}

/**
 * Commands the learner has actually been taught, derived from completed steps' command
 * anatomy — never a hardcoded list. Used by the dashboard "recently learned" panel and the
 * Progress page; deliberately does not depend on a separate activity log.
 */
export function commandsLearned(progress: UserProgress): CommandMeta[] {
  const seen = new Set<string>();
  const learned: CommandMeta[] = [];
  for (const lessonId of progress.completedLessonIds) {
    const lesson = lessonById(lessonId);
    if (!lesson) continue;
    for (const step of lesson.steps) {
      const line = step.anatomy?.line;
      if (!line) continue;
      const name = line.trim().split(/\s+/)[0]?.toLowerCase();
      if (!name || seen.has(name)) continue;
      const meta = COMMANDS.find((c) => c.name === name || c.aliases?.includes(name));
      if (!meta || seen.has(meta.name)) continue;
      seen.add(meta.name);
      seen.add(name);
      learned.push(meta);
    }
  }
  return learned;
}

export { FILES_LESSONS, isInteractiveKind, lessonById };
