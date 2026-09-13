import { describe, expect, it } from 'vitest';
import { convertLegacyXp, deriveAmountForKey } from './legacyXp';

// Ground truth from src/data/curriculum.ts: lesson files-1 has xp 10, step f1-echo has xp 10.
describe('deriveAmountForKey', () => {
  it('derives a step base award', () => {
    expect(deriveAmountForKey('step:files-1:f1-echo')).toBe(10);
  });

  it('derives the unaided bonus as 20% of the step base, rounded up', () => {
    expect(deriveAmountForKey('step:files-1:f1-echo:unaided')).toBe(2);
  });

  it('derives a lesson completion award', () => {
    expect(deriveAmountForKey('lesson:files-1:complete')).toBe(10);
  });

  it('derives a mission award', () => {
    expect(deriveAmountForKey('mission:m-messy-desktop')).toBe(80);
  });

  it('returns null for a key whose source no longer exists', () => {
    expect(deriveAmountForKey('step:files-1:no-such-step')).toBeNull();
    expect(deriveAmountForKey('lesson:no-such-lesson:complete')).toBeNull();
    expect(deriveAmountForKey('mission:no-such-mission')).toBeNull();
  });

  it('returns null for an unrecognized key shape', () => {
    expect(deriveAmountForKey('not-a-real-key-format')).toBeNull();
  });
});

describe('convertLegacyXp', () => {
  it('needs no residual event when every key is fully derivable and the total matches', () => {
    const keys = ['step:files-1:f1-echo', 'step:files-1:f1-echo:unaided', 'lesson:files-1:complete'];
    const events = convertLegacyXp(keys, 22, 'fp-1');
    expect(events).toEqual([
      { key: 'step:files-1:f1-echo', amount: 10 },
      { key: 'step:files-1:f1-echo:unaided', amount: 2 },
      { key: 'lesson:files-1:complete', amount: 10 },
    ]);
  });

  it('carries the undeliverable gap as one stable balancing event', () => {
    const events = convertLegacyXp(['some-unrecognized-key'], 50, 'fp-2');
    expect(events).toEqual([
      { key: 'some-unrecognized-key', amount: 0 },
      { key: 'legacy-import-balance:fp-2', amount: 50 },
    ]);
  });

  it('adds no balancing event when derived amounts already exceed or equal the legacy total', () => {
    const events = convertLegacyXp(['lesson:files-1:complete'], 5, 'fp-3');
    expect(events.find((e) => e.key.startsWith('legacy-import-balance'))).toBeUndefined();
  });

  it('is idempotent: converting the same ledger twice yields the same events, so re-importing cannot duplicate XP', () => {
    const keys = ['some-unrecognized-key', 'step:files-1:f1-echo'];
    const first = convertLegacyXp(keys, 60, 'fp-stable');
    const second = convertLegacyXp(keys, 60, 'fp-stable');
    expect(second).toEqual(first);
  });
});
