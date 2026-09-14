import { describe, expect, it } from 'vitest';
import { normalizeProgress } from './tutorial';
import { applyAchievements, awardXp } from './xp';

describe('awardXp', () => {
  it('grants the amount and records the key on first award', () => {
    const progress = normalizeProgress({});
    const { progress: next, gained } = awardXp(progress, 'lesson:files-1:complete', 10);
    expect(gained).toBe(10);
    expect(next.xp).toBe(10);
    expect(next.awardedXpKeys).toContain('lesson:files-1:complete');
  });

  it('never re-awards the same key — the core idempotency guarantee', () => {
    const progress = normalizeProgress({});
    const first = awardXp(progress, 'lesson:files-1:complete', 10);
    const second = awardXp(first.progress, 'lesson:files-1:complete', 10);
    expect(second.gained).toBe(0);
    expect(second.progress.xp).toBe(10); // unchanged — not 20
    expect(second.progress.awardedXpKeys.filter((k) => k === 'lesson:files-1:complete')).toHaveLength(1);
  });

  it('a non-positive amount is a no-op, even for an unseen key', () => {
    const progress = normalizeProgress({});
    const { gained, progress: next } = awardXp(progress, 'some-key', 0);
    expect(gained).toBe(0);
    expect(next.awardedXpKeys).not.toContain('some-key');
  });
});

describe('applyAchievements', () => {
  it('unlocks an achievement exactly once even if applied repeatedly against the same progress', () => {
    const progress = normalizeProgress({ commandCount: 1 }); // satisfies "first-command"
    const first = applyAchievements(progress);
    expect(first.achievements).toContain('first-command');

    const second = applyAchievements(first.progress);
    expect(second.achievements).toEqual([]); // nothing "newly" unlocked the second time
    expect(second.progress.unlockedAchievementIds.filter((id) => id === 'first-command')).toHaveLength(1);
  });

  it('reports no newly-unlocked achievements when nothing qualifies yet', () => {
    const progress = normalizeProgress({});
    expect(applyAchievements(progress).achievements).toEqual([]);
  });
});
