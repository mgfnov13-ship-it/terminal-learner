import { describe, expect, it } from 'vitest';
import type { SettingsState, UserProgress } from '../../types';
import { normalizeProgress } from '../../engine/tutorial';
import { DEFAULT_SETTINGS } from '../../engine/storage';
import { computeProgressDiff, isDiffEmpty } from './diff';

function progress(patch: Partial<UserProgress>): UserProgress {
  return { ...normalizeProgress({}), ...patch };
}

function settings(patch: Partial<SettingsState>): SettingsState {
  return { ...DEFAULT_SETTINGS, ...patch };
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

  it('only reports the account-synced settings subset, never the device-local fields', () => {
    const p = progress({});
    const prevSettings = settings({ appearance: 'dark', terminalFontSize: 14 });
    const nextSettings = settings({ appearance: 'light', terminalFontSize: 18 }); // font size changed too
    const diff = computeProgressDiff(p, p, prevSettings, nextSettings);
    expect(diff.settings).toEqual({
      theme: 'light',
      reducedMotion: false,
      lessonHints: true,
      language: 'en',
      textScale: 'standard',
      highContrast: false,
    });
  });

  it('reports no settings change when only a device-local field changed', () => {
    const p = progress({});
    const prevSettings = settings({ terminalFontSize: 14 });
    const nextSettings = settings({ terminalFontSize: 18, sound: true, showTimestamps: true });
    expect(computeProgressDiff(p, p, prevSettings, nextSettings).settings).toBeNull();
  });

  it('seeds the cloud from local when there was no previous snapshot at all', () => {
    const p = progress({});
    const diff = computeProgressDiff(p, p, undefined, settings({ appearance: 'light' }));
    expect(diff.settings).toEqual({
      theme: 'light',
      reducedMotion: false,
      lessonHints: true,
      language: 'en',
      textScale: 'standard',
      highContrast: false,
    });
  });
});
