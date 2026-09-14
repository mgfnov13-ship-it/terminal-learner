import { describe, expect, it } from 'vitest';
import type { UserProgress } from '../../types';
import { normalizeProgress } from '../../engine/tutorial';
import { reconcileProgress, unionStrings, type CloudProgressSnapshot } from './reconcile';

function progress(patch: Partial<UserProgress>): UserProgress {
  return { ...normalizeProgress({}), ...patch };
}

function cloud(patch: Partial<CloudProgressSnapshot>): CloudProgressSnapshot {
  return {
    completedStepIds: [],
    completedLessonIds: [],
    completedMissionIds: [],
    unlockedAchievementIds: [],
    xpEventKeys: [],
    xpTotal: 0,
    currentLessonId: null,
    onboardingComplete: false,
    settings: null,
    ...patch,
  };
}

describe('unionStrings', () => {
  it('dedupes while preserving membership from both sides', () => {
    expect(unionStrings(['a', 'b'], ['b', 'c']).sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('reconcileProgress', () => {
  it('passes local through unchanged when there is no cloud account progress yet', () => {
    const local = progress({ completedLessonIds: ['files-1'], xp: 10, currentLessonId: 'files-2' });
    const result = reconcileProgress(local, null);
    expect(result.completedLessonIds).toEqual(['files-1']);
    expect(result.xp).toBe(10);
    expect(result.currentLessonId).toBe('files-2');
  });

  it('unions additive arrays instead of overwriting either side', () => {
    const local = progress({ completedLessonIds: ['files-1'], completedStepIds: ['f1-echo'] });
    const remote = cloud({ completedLessonIds: ['files-2'], completedStepIds: ['f2-try'] });
    const result = reconcileProgress(local, remote);
    expect(result.completedLessonIds.sort()).toEqual(['files-1', 'files-2']);
    expect(result.completedStepIds.sort()).toEqual(['f1-echo', 'f2-try']);
  });

  it('computes XP from the cloud total plus only genuinely new local keys, never by adding two totals', () => {
    const local = progress({
      xp: 999, // a stale/inflated local total must not leak into the merge
      awardedXpKeys: ['lesson:files-1:complete', 'step:files-1:f1-echo'],
    });
    const remote = cloud({ xpTotal: 10, xpEventKeys: ['lesson:files-1:complete'] });
    const result = reconcileProgress(local, remote);
    // Only 'step:files-1:f1-echo' (xp 10) is new; 'lesson:files-1:complete' is already on the cloud.
    expect(result.xp).toBe(20);
    expect(result.awardedXpKeys.sort()).toEqual(['lesson:files-1:complete', 'step:files-1:f1-echo']);
  });

  it('prefers the cloud current-lesson pointer once the cloud account has any progress', () => {
    const local = progress({ currentLessonId: 'files-3' });
    const remote = cloud({ completedLessonIds: ['files-1'], currentLessonId: 'files-2' });
    expect(reconcileProgress(local, remote).currentLessonId).toBe('files-2');
  });

  it('falls back to the local current-lesson pointer when the cloud account has no progress yet', () => {
    const local = progress({ currentLessonId: 'files-3' });
    const remote = cloud({ currentLessonId: null });
    expect(reconcileProgress(local, remote).currentLessonId).toBe('files-3');
  });

  it('onboardingComplete is a boolean OR — true wins permanently once set on either side', () => {
    expect(reconcileProgress(progress({ onboardingComplete: true }), cloud({ onboardingComplete: false })).onboardingComplete).toBe(true);
    expect(reconcileProgress(progress({ onboardingComplete: false }), cloud({ onboardingComplete: true })).onboardingComplete).toBe(true);
  });

  it('is idempotent: reconciling again against the already-merged result changes nothing', () => {
    const local = progress({
      completedLessonIds: ['files-1'],
      awardedXpKeys: ['lesson:files-1:complete'],
      xp: 10,
      onboardingComplete: true,
    });
    const remote = cloud({
      completedLessonIds: ['files-2'],
      xpEventKeys: ['lesson:files-2:complete'],
      xpTotal: 10,
      currentLessonId: 'files-2',
      onboardingComplete: false,
    });
    const first = reconcileProgress(local, remote);
    const secondRoundLocal = { ...local, ...first };
    const second = reconcileProgress(secondRoundLocal, {
      ...remote,
      completedLessonIds: first.completedLessonIds,
      xpEventKeys: first.awardedXpKeys,
      xpTotal: first.xp,
    });
    expect(second).toEqual(first);
  });
});
