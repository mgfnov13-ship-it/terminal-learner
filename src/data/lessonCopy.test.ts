import { describe, expect, it } from 'vitest';
import { FILES_LESSONS } from './curriculum';
import { LESSON_COPY, STEP_COPY } from './lessonCopy';
import { MISSIONS } from './missions';
import { MISSION_COPY } from './contentCopy';

describe('bilingual curriculum overlays', () => {
  it('covers every Files lesson title in both languages', () => {
    for (const lesson of FILES_LESSONS) {
      const copy = LESSON_COPY[lesson.id];
      expect(copy, lesson.id).toBeTruthy();
      expect(copy.title.ar.length).toBeGreaterThan(0);
      expect(copy.title.en.length).toBeGreaterThan(0);
      expect(copy.subtitle.ar.length).toBeGreaterThan(0);
    }
  });

  it('covers instructional copy for every step', () => {
    for (const lesson of FILES_LESSONS) {
      for (const step of lesson.steps) {
        const copy = STEP_COPY[step.id];
        expect(copy, step.id).toBeTruthy();
        expect(copy.title?.ar.length ?? 0).toBeGreaterThan(0);
        expect(copy.body?.ar.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it('covers every mission', () => {
    for (const mission of MISSIONS) {
      expect(MISSION_COPY[mission.id], mission.id).toBeTruthy();
    }
  });
});
