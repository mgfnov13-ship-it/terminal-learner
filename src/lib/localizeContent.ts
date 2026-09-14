import type { Language, LocalizedText } from './i18n';
import { localize } from './i18n';
import type { LessonDef, TutorialStep } from '../types/tutorial';
import { ACHIEVEMENT_COPY, MISSION_COPY, TRACK_COPY, UNIT_COPY } from '../data/contentCopy';
import { LESSON_COPY, STEP_COPY } from '../data/lessonCopy';
import { COMMAND_CATEGORIES, COMMAND_SUMMARIES } from '../data/pageCopy';
import { lessonById } from '../data/curriculum';

export function trackName(id: string, language: Language): string {
  return TRACK_COPY[id] ? localize(language, TRACK_COPY[id].name) : id;
}

export function trackTagline(id: string, language: Language): string {
  return TRACK_COPY[id] ? localize(language, TRACK_COPY[id].tagline) : '';
}

export function trackBlurb(id: string, language: Language): string {
  return TRACK_COPY[id] ? localize(language, TRACK_COPY[id].blurb) : '';
}

export function unitName(id: string, language: Language, fallback = ''): string {
  return UNIT_COPY[id] ? localize(language, UNIT_COPY[id].name) : fallback;
}

export function unitSummary(id: string, language: Language, fallback = ''): string {
  return UNIT_COPY[id] ? localize(language, UNIT_COPY[id].summary) : fallback;
}

export function lessonTitle(id: string, language: Language): string {
  if (LESSON_COPY[id]) return localize(language, LESSON_COPY[id].title);
  return lessonById(id)?.title ?? id;
}

export function lessonSubtitle(id: string, language: Language): string {
  if (LESSON_COPY[id]) return localize(language, LESSON_COPY[id].subtitle);
  return lessonById(id)?.subtitle ?? '';
}

export function missionTitle(id: string, language: Language, fallback = ''): string {
  return MISSION_COPY[id] ? localize(language, MISSION_COPY[id].title) : fallback;
}

export function missionField(
  id: string,
  field: 'scenario' | 'briefing' | 'objective' | 'hint' | 'difficulty',
  language: Language,
  fallback = '',
): string {
  return MISSION_COPY[id] ? localize(language, MISSION_COPY[id][field]) : fallback;
}

export function achievementTitle(id: string, language: Language, fallback = ''): string {
  return ACHIEVEMENT_COPY[id] ? localize(language, ACHIEVEMENT_COPY[id].title) : fallback;
}

export function achievementDescription(id: string, language: Language, fallback = ''): string {
  return ACHIEVEMENT_COPY[id] ? localize(language, ACHIEVEMENT_COPY[id].description) : fallback;
}

function overlayStep(step: TutorialStep, language: Language): TutorialStep {
  const copy = STEP_COPY[step.id];
  if (!copy) return step;
  return {
    ...step,
    title: copy.title ? localize(language, copy.title) : step.title,
    body: copy.body ? localize(language, copy.body) : step.body,
    prompt: copy.prompt ? localize(language, copy.prompt) : step.prompt,
    hints: copy.hints?.map((hint: LocalizedText, index: number) => localize(language, hint) || step.hints?.[index] || '') ?? step.hints,
    successTitle: copy.successTitle ? localize(language, copy.successTitle) : step.successTitle,
    successBody: copy.successBody ? localize(language, copy.successBody) : step.successBody,
    answer:
      step.answer && copy.explanation
        ? { ...step.answer, explanation: localize(language, copy.explanation) }
        : step.answer,
    question:
      step.question && copy.question
        ? {
            ...step.question,
            prompt: localize(language, copy.question.prompt),
            explanation: copy.question.explanation
              ? localize(language, copy.question.explanation)
              : step.question.explanation,
            choices: step.question.choices.map((choice) => ({
              ...choice,
              label: copy.question?.choices?.[choice.id]
                ? localize(language, copy.question.choices[choice.id])
                : choice.label,
            })),
          }
        : step.question,
  };
}

export function localizeLesson(lesson: LessonDef, language: Language): LessonDef {
  const meta = LESSON_COPY[lesson.id];
  return {
    ...lesson,
    title: meta ? localize(language, meta.title) : lesson.title,
    subtitle: meta ? localize(language, meta.subtitle) : lesson.subtitle,
    steps: lesson.steps.map((step) => overlayStep(step, language)),
  };
}

export function pick(language: Language, value: LocalizedText): string {
  return localize(language, value);
}

export function commandSummary(name: string, language: Language, fallback = ''): string {
  return COMMAND_SUMMARIES[name] ? localize(language, COMMAND_SUMMARIES[name]) : fallback;
}

export function commandCategory(name: string, language: Language, fallback = ''): string {
  return COMMAND_CATEGORIES[name] ? localize(language, COMMAND_CATEGORIES[name]) : fallback;
}
