export type NodeType = 'file' | 'folder';

export interface FSNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  createdAt: number;
  modifiedAt: number;
  content?: string;
}

export interface RecycleEntry {
  node: FSNode;
  children: FSNode[];
  originalParentId: string | null;
  originalPath: string;
  deletedAt: number;
}

export interface VfsData {
  nodes: FSNode[];
  recycle: RecycleEntry[];
}

export type AppId =
  | 'terminal'
  | 'explorer'
  | 'recycle'
  | 'academy'
  | 'settings'
  | 'help'
  | 'thispc';

export interface WindowRecord {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  restore?: { x: number; y: number; w: number; h: number };
  explorerPath?: string;
  explorerHistory?: string[];
  explorerIndex?: number;
  explorerView?: 'grid' | 'list';
}

export type Appearance = 'dark' | 'light' | 'system';
export type TerminalFont = 'chivo' | 'ibm' | 'jetbrains';

export interface SettingsState {
  appearance: Appearance;
  terminalFontSize: number;
  terminalFont: TerminalFont;
  showTimestamps: boolean;
  sound: boolean;
  showHints: boolean;
}

export interface UserProgress {
  xp: number;
  completedMissionIds: string[];
  unlockedAchievementIds: string[];
  listedDirectories: boolean;
  commandCount: number;
  createdFile: boolean;
  createdFolder: boolean;
  copiedFile: boolean;
  deletedItem: boolean;
}

export interface MissionDef {
  id: string;
  levelId: number;
  order: number;
  title: string;
  briefing: string;
  objective: string;
  hint: string;
  xp: number;
  check: (ctx: MissionContext) => boolean;
}

export interface MissionContext {
  vfs: import('../engine/virtualFileSystem').VirtualFileSystem;
  cwd: string;
  listedDirectories: boolean;
}

export interface LevelDef {
  id: number;
  name: string;
  subtitle: string;
  lockedUntilXp: number;
  implemented: boolean;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  check: (progress: UserProgress) => boolean;
}

export interface CommandMeta {
  name: string;
  aliases?: string[];
  category: 'Navigation' | 'Files' | 'Folders' | 'Copying' | 'Moving' | 'Deleting' | 'Utilities';
  summary: string;
  usage: string;
  example: string;
}

export interface CommandResult {
  output: string;
  error?: boolean;
  exit?: boolean;
  clear?: boolean;
  listed?: boolean;
  createdFile?: boolean;
  createdFolder?: boolean;
  copied?: boolean;
  deleted?: boolean;
  renamed?: boolean;
  moved?: boolean;
}

export interface ToastItem {
  id: string;
  kind: 'ok' | 'xp' | 'achievement' | 'error' | 'info';
  title: string;
  body?: string;
}

export interface ConfirmState {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
}

export interface PersistedState {
  vfs: VfsData;
  cwd: string;
  progress: UserProgress;
  settings: SettingsState;
  seenWelcome: boolean;
  seenBoot: boolean;
}

export interface SessionFlags {
  lastXpGain: number;
  lastLevelUp: number;
  lastAchievement: string | null;
}
