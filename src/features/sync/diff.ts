import type { UserProgress } from '../../types';
import { FILES_LESSONS } from '../../data/curriculum';
import { deriveAmountForKey } from './legacyXp';
import { EMPTY_DIFF, isDiffEmpty, type ProgressDiff } from './progressRepository';

const STEP_TO_LESSON = new Map<string, string>();
for (const lesson of FILES_LESSONS) {
  for (const step of lesson.steps) STEP_TO_LESSON.set(step.id, lesson.id);
}

function onlyNew(prev: string[], next: string[]): string[] {
  if (next.length === prev.length) return [];
  const seen = new Set(prev);
  return next.filter((id) => !seen.has(id));
}

/**
 * What changed in the local progress snapshot since the sync layer last mirrored it outward.
 * Pure and side-effect free so it's easy to reason about (and test) independently of the
 * store/subscription plumbing that calls it.
 */
export function computeProgressDiff(prev: UserProgress, next: UserProgress): ProgressDiff {
  const newStepIds = onlyNew(prev.completedStepIds, next.completedStepIds)
    .map((stepId) => ({ stepId, lessonId: STEP_TO_LESSON.get(stepId) ?? '' }))
    .filter((s) => s.lessonId);
  const newLessonIds = onlyNew(prev.completedLessonIds, next.completedLessonIds);
  const newMissionIds = onlyNew(prev.completedMissionIds, next.completedMissionIds);
  const newAchievementIds = onlyNew(prev.unlockedAchievementIds, next.unlockedAchievementIds);
  const newXpEvents = onlyNew(prev.awardedXpKeys, next.awardedXpKeys).map((key) => ({
    key,
    amount: deriveAmountForKey(key) ?? 0,
  }));
  const currentLessonId = next.currentLessonId !== prev.currentLessonId ? next.currentLessonId : null;

  const diff: ProgressDiff = { ...EMPTY_DIFF, newStepIds, newLessonIds, newMissionIds, newAchievementIds, newXpEvents, currentLessonId };
  return diff;
}

export { isDiffEmpty };
