import type { PersistedState, SettingsState, UserProgress } from '../types';
import { readStored } from '../lib/storageSafe';
import { HOME } from './paths';
import { normalizeProgress } from './tutorial';
import { VirtualFileSystem } from './virtualFileSystem';

const BASE_KEY = 'terminal-space-v1';

/** Guest/local-mode progress lives at the base key; a signed-in account gets its own namespace. */
export function storageKey(userId?: string | null): string {
  return userId ? `${BASE_KEY}:user:${userId}` : BASE_KEY;
}

export const DEFAULT_SETTINGS: SettingsState = {
  appearance: 'dark',
  terminalFontSize: 14,
  showTimestamps: false,
  sound: false,
  showHints: true,
  reducedMotion: false,
  language: 'en',
  textScale: 'standard',
  highContrast: false,
};

export const DEFAULT_PROGRESS: UserProgress = normalizeProgress({});

/** Older saves may miss keys or carry keys that no longer exist (e.g. terminalFont). */
export function normalizeSettings(raw: Partial<SettingsState> | undefined): SettingsState {
  const s = raw ?? {};
  const appearance = s.appearance === 'light' || s.appearance === 'system' ? s.appearance : 'dark';
  const size = Number(s.terminalFontSize);
  const language = s.language === 'ar' || s.language === 'en' ? s.language : readStored('ts_language', 'en', ['ar', 'en']);
  const textScale =
    s.textScale === 'large' || s.textScale === 'larger' || s.textScale === 'standard'
      ? s.textScale
      : readStored('ts_text_scale', 'standard', ['standard', 'large', 'larger']);
  return {
    appearance,
    terminalFontSize: Number.isFinite(size) ? Math.min(20, Math.max(12, size)) : DEFAULT_SETTINGS.terminalFontSize,
    showTimestamps: Boolean(s.showTimestamps),
    sound: Boolean(s.sound),
    showHints: s.showHints ?? true,
    reducedMotion: Boolean(s.reducedMotion),
    language,
    textScale,
    highContrast: Boolean(s.highContrast) || readStored('ts_high_contrast', 'false', ['true', 'false']) === 'true',
  };
}

export function loadState(userId?: string | null): PersistedState | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
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

export function saveState(state: PersistedState, userId?: string | null): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(state));
  } catch {
    // Quota or private mode: keep running in memory.
  }
}

/** The original pre-auth guest save, if this browser has one — the source for account migration. */
export function loadLegacyState(): PersistedState | null {
  return loadState(undefined);
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
