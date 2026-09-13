import type { PersistedState, SettingsState, UserProgress } from '../types';
import { HOME } from './paths';
import { normalizeProgress } from './tutorial';
import { VirtualFileSystem } from './virtualFileSystem';

const KEY = 'terminal-space-v1';

export const DEFAULT_SETTINGS: SettingsState = {
  appearance: 'dark',
  terminalFontSize: 14,
  showTimestamps: false,
  sound: false,
  showHints: true,
  reducedMotion: false,
};

export const DEFAULT_PROGRESS: UserProgress = normalizeProgress({});

/** Older saves may miss keys or carry keys that no longer exist (e.g. terminalFont). */
export function normalizeSettings(raw: Partial<SettingsState> | undefined): SettingsState {
  const s = raw ?? {};
  const appearance = s.appearance === 'light' || s.appearance === 'system' ? s.appearance : 'dark';
  const size = Number(s.terminalFontSize);
  return {
    appearance,
    terminalFontSize: Number.isFinite(size) ? Math.min(20, Math.max(12, size)) : DEFAULT_SETTINGS.terminalFontSize,
    showTimestamps: Boolean(s.showTimestamps),
    sound: Boolean(s.sound),
    showHints: s.showHints ?? true,
    reducedMotion: Boolean(s.reducedMotion),
  };
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.vfs?.nodes) return null;
    return {
      ...parsed,
      progress: normalizeProgress(parsed.progress),
      settings: normalizeSettings(parsed.settings),
    };
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode: keep running in memory.
  }
}

export function exportState(state: PersistedState): string {
  return JSON.stringify(state, null, 2);
}

export function parseImported(raw: string): PersistedState | null {
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.vfs?.nodes || !parsed.progress || !parsed.settings) return null;
    return { ...parsed, progress: normalizeProgress(parsed.progress), settings: normalizeSettings(parsed.settings) };
  } catch {
    return null;
  }
}

export function freshPersist(partial?: Partial<PersistedState>): PersistedState {
  return {
    vfs: VirtualFileSystem.seed().toJSON(),
    cwd: HOME,
    progress: { ...DEFAULT_PROGRESS },
    settings: { ...DEFAULT_SETTINGS },
    seenWelcome: false,
    seenBoot: false,
    ...partial,
  };
}
