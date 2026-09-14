import { describe, expect, it } from 'vitest';
import { normalizeProgress } from '../engine/tutorial';
import { ACHIEVEMENTS, achievementProgress } from './achievements';

function find(id: string) {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) throw new Error(`missing achievement ${id}`);
  return a;
}

describe('achievementProgress', () => {
  it('returns null for binary achievements — never fabricates a progress bar', () => {
    expect(achievementProgress(find('first-command'), normalizeProgress({}))).toBeNull();
    expect(achievementProgress(find('organizer'), normalizeProgress({}))).toBeNull();
  });

  it('caps numeric progress at the target, even if the underlying count overshoots', () => {
    const progress = normalizeProgress({ commandCount: 999 });
    expect(achievementProgress(find('twenty-commands'), progress)).toEqual({ current: 20, target: 20 });
  });

  it('derives mission progress from actual completed missions, not a hardcoded number', () => {
    const progress = normalizeProgress({ completedMissionIds: ['m-a', 'm-b'] });
    expect(achievementProgress(find('mission-veteran'), progress)).toEqual({ current: 2, target: 3 });
  });
});
