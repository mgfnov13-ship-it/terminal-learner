import type { PersistedState, SettingsState, UserProgress } from '../types';
import { HOME } from './paths';
import { VirtualFileSystem } from './virtualFileSystem';

const KEY = 'terminal-academy-v1';

export const DEFAULT_SETTINGS: SettingsState = {
  appearance: 'dark',
  terminalFontSize: 14,
  terminalFont: 'chivo',
  showTimestamps: false,
  sound: false,
  showHints: true,
};

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  completedMissionIds: [],
  unlockedAchievementIds: [],
  listedDirectories: false,
  commandCount: 0,
  createdFile: false,
  createdFolder: false,
  copiedFile: false,
  deletedItem: false,
};

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.vfs?.nodes) return null;
    return parsed;
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
    return parsed;
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
