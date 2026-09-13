import type { VirtualFileSystem } from '../engine/virtualFileSystem';

export type TutorialStepKind =
  | 'intro'
  | 'concept'
  | 'demo'
  | 'try'
  | 'check'
  | 'question'
  | 'feedback'
  | 'summary'
  | 'mission';

export type GuidanceLevel = 'guided' | 'semi' | 'independent';

export type CommandPartRole = 'command' | 'argument' | 'source' | 'destination' | 'flag' | 'path';

export interface CommandPart {
  text: string;
  role: CommandPartRole;
}

export interface CommandAnatomy {
  line: string;
  parts: CommandPart[];
}

/** What "Show answer" reveals. Stored in lesson data, never inferred from UI text. */
export interface AnswerDef {
  /** What the learner should type. Multi-line means several commands. */
  command?: string;
  /** For answers that are not commands, e.g. the correct choice in a knowledge check. */
  label?: string;
  /** Optional breakdown shown under the command. */
  parts?: CommandPart[];
  explanation: string;
}

export type Validator =
  | { type: 'filesystemExists'; path: string; entityType?: 'file' | 'directory' }
  | { type: 'filesystemNotExists'; path: string }
  | { type: 'currentDirectory'; path: string }
  | { type: 'fileContent'; path: string; contains?: string; equals?: string }
  | { type: 'commandExecuted'; command: string; argsInclude?: string[] }
  | { type: 'outputContains'; substring: string }
  | { type: 'multipleConditions'; mode?: 'all' | 'any'; conditions: Validator[] };

export type SetupOp =
  | { type: 'ensureFolder'; path: string }
  | { type: 'ensureFile'; path: string; content?: string }
  | { type: 'cwd'; path: string };

export interface QuestionChoice {
  id: string;
  label: string;
}

export interface KnowledgeQuestion {
  prompt: string;
  choices: QuestionChoice[];
  correctId: string;
  explanation: string;
}

export interface TutorialStep {
  id: string;
  kind: TutorialStepKind;
  title: string;
  body: string;
  anatomy?: CommandAnatomy;
  prompt?: string;
  example?: string;
  guidance?: GuidanceLevel;
  hints?: string[];
  answer?: AnswerDef;
  validators?: Validator[];
  question?: KnowledgeQuestion;
  xp?: number;
  highlightTerminal?: boolean;
  successTitle?: string;
  successBody?: string;
}

export interface LessonDef {
  id: string;
  trackId: string;
  levelId: number;
  order: number;
  title: string;
  subtitle: string;
  xp: number;
  startCwd: string;
  setup: SetupOp[];
  steps: TutorialStep[];
}

export interface LastCommand {
  raw: string;
  name: string;
  args: string[];
  output: string;
  error: boolean;
  cwdBefore: string;
  cwdAfter: string;
  createdFolder?: boolean;
  createdFile?: boolean;
  listed?: boolean;
  renamed?: boolean;
  copied?: boolean;
  moved?: boolean;
  deleted?: boolean;
}

export interface StepEvents {
  commands: string[];
  listed: boolean;
}

export interface CoachMessage {
  tone: 'ok' | 'try' | 'info';
  title: string;
  body: string;
}

export interface ValidateContext {
  vfs: VirtualFileSystem;
  cwd: string;
  lastCommand: LastCommand | null;
  events: StepEvents;
}

export type AcademyTab = 'learn' | 'missions';
