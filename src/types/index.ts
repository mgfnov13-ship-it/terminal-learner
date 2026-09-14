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
export type LanguagePref = 'ar' | 'en';
export type TextScalePref = 'standard' | 'large' | 'larger';

export interface SettingsState {
  appearance: Appearance;
  terminalFontSize: number;
  showTimestamps: boolean;
  sound: boolean;
  showHints: boolean;
  reducedMotion: boolean;
  language: LanguagePref;
  textScale: TextScalePref;
  highContrast: boolean;
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
  currentLessonId: string;
  currentStepIndex: number;
  completedLessonIds: string[];
  completedStepIds: string[];
  awardedXpKeys: string[];
  hintLevelByStep: Record<string, number>;
  /** Permanent ledger: steps where the learner asked for the answer. Drives the unaided bonus. */
  showedAnswerIds: string[];
  /** The one step whose answer is currently on screen. Scoped to the current step. */
  revealedAnswerStepId: string | null;
  onboardingComplete: boolean;
  academyTab: 'learn' | 'missions';
  activeMissionId: string | null;
}

export type MissionDifficulty = 'Starter' | 'Intermediate' | 'Advanced';

export interface MissionDef {
  id: string;
  order: number;
  title: string;
  difficulty: MissionDifficulty;
  /** One line of situation, shown on the mission card. */
  scenario: string;
  briefing: string;
  objective: string;
  hint: string;
  /** Commands this mission exercises. Display only. */
  skills: string[];
  /** Lessons that must be finished first, so a mission never asks for untaught skills. */
  requiresLessonIds: string[];
  xp: number;
  startCwd: string;
  setup: import('./tutorial').SetupOp[];
  check: (ctx: MissionContext) => boolean;
}

export interface MissionContext {
  vfs: import('../engine/virtualFileSystem').VirtualFileSystem;
  cwd: string;
  listedDirectories: boolean;
}

export type AchievementCategory = 'Learning' | 'Terminal' | 'Files' | 'Missions' | 'Mastery';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
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
  commandName?: string;
  args?: string[];
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
  /** Which lesson/mission the saved filesystem belongs to, so a refresh never rebuilds it. */
  activeEnvId?: string;
}

export interface SessionFlags {
  lastXpGain: number;
  lastLevelUp: number;
  lastAchievement: string | null;
}
