import { describe, expect, it } from 'vitest';
import type { UserProgress } from '../../types';
import { normalizeProgress } from '../../engine/tutorial';
import { computeProgressDiff, isDiffEmpty } from './diff';

function progress(patch: Partial<UserProgress>): UserProgress {
  return { ...normalizeProgress({}), ...patch };
}

describe('computeProgressDiff', () => {
  it('reports no changes as an empty diff', () => {
    const p = progress({ completedLessonIds: ['files-1'] });
    expect(isDiffEmpty(computeProgressDiff(p, p))).toBe(true);
  });

  it('only reports items that are new since the last snapshot', () => {
    const prev = progress({ completedStepIds: ['f1-echo'] });
    const next = progress({ completedStepIds: ['f1-echo', 'f2-try'] });
    const diff = computeProgressDiff(prev, next);
    expect(diff.newStepIds).toEqual([{ stepId: 'f2-try', lessonId: 'files-2' }]);
  });

  it('reports a current-lesson change only when it actually changed', () => {
    const prev = progress({ currentLessonId: 'files-1' });
    const same = computeProgressDiff(prev, progress({ currentLessonId: 'files-1' }));
    expect(same.currentLessonId).toBeNull();
    const changed = computeProgressDiff(prev, progress({ currentLessonId: 'files-2' }));
    expect(changed.currentLessonId).toBe('files-2');
  });

  it('never re-reports something already seen, even if the array order changes', () => {
    const prev = progress({ completedMissionIds: ['m-a', 'm-b'] });
    const next = progress({ completedMissionIds: ['m-b', 'm-a'] });
    expect(computeProgressDiff(prev, next).newMissionIds).toEqual([]);
  });
});
