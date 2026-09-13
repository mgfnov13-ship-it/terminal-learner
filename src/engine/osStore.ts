import type {
  AppId,
  ConfirmState,
  PersistedState,
  SettingsState,
  ToastItem,
  UserProgress,
  WindowRecord,
} from '../types';
import type { AcademyTab, CoachMessage, LastCommand, StepEvents } from '../types/tutorial';
import { ACHIEVEMENTS } from '../data/achievements';
import { lessonById } from '../data/curriculum';
import { MISSIONS, missionById } from '../data/missions';
import { levelFromXp } from '../data/player';
import { COMMAND_NAMES, executeCommand } from './commandParser';
import { coachForStep, successCoach } from './coach';
import { buildEnvironment, buildLessonEnvironment } from './lessonSetup';
import { HOME } from './paths';
import { applyCommandFlags, evaluatePracticeMission, withAchievements } from './progress';
import { playTone } from './sound';
import {
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  exportState,
  loadState,
  parseImported,
  saveState,
} from './storage';
import {
  activeLesson,
  activeStep,
  firstLesson,
  isAwaitingTerminal,
  isInteractiveKind,
  isLessonCompleteView,
  nextLesson,
  stepSupportsAnswer,
} from './tutorial';
import { EMPTY_EVENTS, interactiveSatisfied, recordCommand } from './validators';
import { VirtualFileSystem } from './virtualFileSystem';
import { awardXp, xpKey, leveledUp } from './xp';

export type Phase = 'welcome' | 'boot' | 'desktop';

export interface OSSnapshot {
  vfs: VirtualFileSystem;
  cwd: string;
  progress: UserProgress;
  settings: SettingsState;
  windows: WindowRecord[];
  focusedId: string | null;
  toasts: ToastItem[];
  confirm: ConfirmState | null;
  phase: Phase;
  startOpen: boolean;
  contextMenu: { x: number; y: number; path: string; nodeId?: string } | null;
  xpBurst: number;
  levelBurst: number | null;
  renamingId: string | null;
  revision: number;
  lastCommand: LastCommand | null;
  coach: CoachMessage | null;
  stepEvents: StepEvents;
  highlightTerminal: boolean;
  awaitingInput: boolean;
  onboardingPage: number;
  questionWrong: string | null;
  /** Which lesson or mission the simulated disk is currently set up for. */
  activeEnvId: string;
  /** Bumped to ask the Terminal window to take keyboard focus. */
  terminalFocusNonce: number;
}

/** Must match --labbar-h / --dock-h in index.css. */
const LAB_BAR_H = 56;
const LAB_DOCK_H = 64;

const APP_META: Record<AppId, { title: string; w: number; h: number }> = {
  terminal: { title: 'Terminal', w: 620, h: 520 },
  explorer: { title: 'File Explorer', w: 780, h: 500 },
  thispc: { title: 'This PC', w: 780, h: 500 },
  recycle: { title: 'Recycle Bin', w: 560, h: 400 },
  academy: { title: 'Academy', w: 540, h: 640 },
  settings: { title: 'Settings', w: 520, h: 520 },
  help: { title: 'Help', w: 520, h: 480 },
};

function defaultWindows(): WindowRecord[] {
  return [];
}

/**
 * The lab is a side-by-side pair inside .lab-stage: terminal left, Academy right.
 * Both are sized from the stage so the whole lesson is visible without scrolling chrome.
 */
function labLayout() {
  const pad = 14;
  const gap = 14;
  const stageW = window.innerWidth;
  const stageH = window.innerHeight - LAB_BAR_H - LAB_DOCK_H;
  const usableW = stageW - pad * 2 - gap;
  const termW = Math.max(340, Math.round(usableW * 0.47));
  const academyW = Math.max(360, usableW - termW);
  const winH = Math.max(320, stageH - pad * 2);
  return {
    stageW,
    stageH,
    terminal: { x: pad, y: pad, w: termW, h: winH },
    academy: { x: pad + termW + gap, y: pad, w: academyW, h: winH },
  };
}

function hydrate(): OSSnapshot {
  const saved = loadState();
  const vfs = saved ? new VirtualFileSystem(saved.vfs) : VirtualFileSystem.seed();
  const progress = saved?.progress ?? { ...DEFAULT_PROGRESS };
  return {
    vfs,
    cwd: saved?.cwd ?? HOME,
    progress,
    settings: saved?.settings ?? { ...DEFAULT_SETTINGS },
    windows: defaultWindows(),
    focusedId: null,
    toasts: [],
    confirm: null,
    phase: saved?.seenWelcome ? (saved.seenBoot ? 'desktop' : 'boot') : 'welcome',
    startOpen: false,
    contextMenu: null,
    xpBurst: 0,
    levelBurst: null,
    renamingId: null,
    revision: 0,
    lastCommand: null,
    coach: null,
    stepEvents: { ...EMPTY_EVENTS },
    highlightTerminal: false,
    awaitingInput: isAwaitingTerminal(progress),
    onboardingPage: 0,
    questionWrong: null,
    activeEnvId: saved?.activeEnvId ?? `lesson:${progress.currentLessonId}`,
    terminalFocusNonce: 0,
  };
}

class OSStore {
  private snap: OSSnapshot = hydrate();
  private listeners = new Set<() => void>();
  private z = 10;
  private persistTimer: number | null = null;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = () => this.snap;

  private emit(patch: Partial<OSSnapshot>) {
    this.snap = { ...this.snap, ...patch, revision: this.snap.revision + 1 };
    this.listeners.forEach((l) => l());
    this.queuePersist();
  }

  private persistPayload(): PersistedState {
    return {
      vfs: this.snap.vfs.toJSON(),
      cwd: this.snap.cwd,
      progress: this.snap.progress,
      settings: this.snap.settings,
      seenWelcome: this.snap.phase !== 'welcome',
      seenBoot: this.snap.phase === 'desktop',
      activeEnvId: this.snap.activeEnvId,
    };
  }

  private queuePersist() {
    if (typeof window === 'undefined') return;
    if (this.persistTimer) window.clearTimeout(this.persistTimer);
    this.persistTimer = window.setTimeout(() => saveState(this.persistPayload()), 80);
  }

  private toast(kind: ToastItem['kind'], title: string, body?: string) {
    const item: ToastItem = { id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind, title, body };
    this.emit({ toasts: [...this.snap.toasts, item].slice(-4) });
    window.setTimeout(() => this.dismissToast(item.id), 4200);
  }

  dismissToast(id: string) {
    this.emit({ toasts: this.snap.toasts.filter((t) => t.id !== id) });
  }

  private applyXp(progress: UserProgress, key: string, amount: number): UserProgress {
    const before = progress.xp;
    const awarded = awardXp(progress, key, amount);
    if (!awarded.gained) return awarded.progress;
    const leveled = leveledUp(before, awarded.progress.xp);
    this.toast('xp', `+${awarded.gained} XP`);
    playTone('xp', this.snap.settings.sound);
    this.emit({ xpBurst: awarded.gained, levelBurst: leveled ?? this.snap.levelBurst });
    if (leveled) this.toast('ok', `Level ${leveled}`);
    if (awarded.gained) window.setTimeout(() => this.emit({ xpBurst: 0 }), 1400);
    if (leveled) window.setTimeout(() => this.emit({ levelBurst: null }), 1800);
    return awarded.progress;
  }

  /**
   * Base XP for finishing a step is never reduced and never taken back. Revealing the
   * answer only forfeits the small unaided bonus, and because both awards are keyed,
   * toggling the answer or repeating a step cannot farm XP.
   */
  private awardStepXp(progress: UserProgress, lessonId: string, stepId: string, base: number): UserProgress {
    let next = this.applyXp(progress, xpKey(['step', lessonId, stepId]), base);
    if (!next.showedAnswerIds.includes(stepId)) {
      const bonus = Math.ceil(base * 0.2);
      next = this.applyXp(next, xpKey(['step', lessonId, stepId, 'unaided']), bonus);
    }
    return next;
  }

  private finishProgress(progress: UserProgress): UserProgress {
    const { progress: next, achievements } = withAchievements(progress);
    for (const id of achievements) {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) this.toast('achievement', 'Achievement unlocked', def.title);
    }
    return next;
  }

  private tutorialFlags(progress: UserProgress): Pick<OSSnapshot, 'awaitingInput' | 'highlightTerminal'> {
    const step = activeStep(progress);
    const awaiting = isAwaitingTerminal(progress);
    return {
      awaitingInput: awaiting,
      highlightTerminal: Boolean(awaiting || step?.highlightTerminal),
    };
  }

  private evaluateTutorial(fromAction: boolean) {
    const progress = this.snap.progress;
    if (!progress.onboardingComplete) return;
    if (progress.academyTab !== 'learn') {
      this.checkPractice(progress);
      return;
    }
    const step = activeStep(progress);
    if (!step || !isInteractiveKind(step.kind)) return;

    const ctx = {
      vfs: this.snap.vfs,
      cwd: this.snap.cwd,
      lastCommand: this.snap.lastCommand,
      events: this.snap.stepEvents,
    };

    const already = progress.completedStepIds.includes(step.id);
    if (already) {
      if (fromAction) this.emit({ coach: successCoach(step, ctx), ...this.tutorialFlags(progress) });
      return;
    }

    if (step.kind === 'try' && !fromAction) return;

    if (interactiveSatisfied(step, ctx)) {
      this.completeStep(step, ctx);
      return;
    }

    if (fromAction) {
      const coach = coachForStep(step, ctx);
      this.emit({ coach, ...this.tutorialFlags(progress) });
    }
  }

  private completeStep(step: NonNullable<ReturnType<typeof activeStep>>, ctx: Parameters<typeof successCoach>[1]) {
    const lesson = activeLesson(this.snap.progress);
    let progress: UserProgress = {
      ...this.snap.progress,
      completedStepIds: this.snap.progress.completedStepIds.includes(step.id)
        ? this.snap.progress.completedStepIds
        : [...this.snap.progress.completedStepIds, step.id],
    };
    progress = this.awardStepXp(progress, lesson.id, step.id, step.xp ?? 0);
    progress = this.finishProgress(progress);
    const coach = successCoach(step, ctx);
    playTone('ok', this.snap.settings.sound);
    this.emit({
      progress,
      coach,
      ...this.tutorialFlags(progress),
    });
  }

  private checkPractice(progress: UserProgress) {
    const result = evaluatePracticeMission(progress, {
      vfs: this.snap.vfs,
      cwd: this.snap.cwd,
      listedDirectories: progress.listedDirectories,
    });
    if (!result.completedMissionId) return;
    const mission = MISSIONS.find((m) => m.id === result.completedMissionId);
    const awarded = this.applyXp(result.progress, xpKey(['mission', result.completedMissionId]), mission?.xp ?? 30);
    const next = this.finishProgress(awarded);
    this.toast('ok', 'Mission complete', mission?.title);
    this.emit({
      progress: next,
      coach: { tone: 'ok', title: 'Mission complete', body: 'That matches the objective.' },
    });
  }

  private afterVfs(flags: Parameters<typeof applyCommandFlags>[1], fromAction: boolean) {
    let progress = applyCommandFlags(this.snap.progress, flags);
    progress = this.finishProgress(progress);
    this.emit({ progress, vfs: this.snap.vfs });
    this.evaluateTutorial(fromAction);
  }

  finishWelcome() {
    this.emit({ phase: 'boot' });
  }

  finishBoot() {
    this.emit({ phase: 'desktop' });
    window.setTimeout(() => this.openLearningWorkspace(), 240);
  }

  skipBoot() {
    this.finishBoot();
  }

  openLearningWorkspace() {
    const hasTerminal = this.snap.windows.some((w) => w.appId === 'terminal');
    const hasAcademy = this.snap.windows.some((w) => w.appId === 'academy');
    if (hasTerminal && hasAcademy) {
      this.openApp('academy');
      return;
    }
    const mobile = typeof window !== 'undefined' && window.innerWidth < 720;
    if (this.snap.progress.completedLessonIds.length === 0 && this.snap.progress.currentStepIndex === 0) {
      this.emit({ cwd: activeLesson(this.snap.progress).startCwd });
    }
    const { terminal, academy } = labLayout();
    this.openApp('terminal', undefined, mobile ? undefined : terminal);
    this.openApp('academy', undefined, mobile ? undefined : academy);
  }

  /** Keep the lab readable when the viewport changes: re-tile the pair, clamp the rest. */
  fitToStage() {
    if (typeof window === 'undefined' || window.innerWidth < 720) return;
    const { terminal, academy, stageW, stageH } = labLayout();
    const windows = this.snap.windows.map((w) => {
      if (w.maximized) return w;
      if (w.appId === 'terminal') return { ...w, ...terminal };
      if (w.appId === 'academy') return { ...w, ...academy };
      const width = Math.min(w.w, stageW - 16);
      const height = Math.min(w.h, stageH - 16);
      return {
        ...w,
        w: width,
        h: height,
        x: Math.max(8, Math.min(w.x, stageW - width - 8)),
        y: Math.max(8, Math.min(w.y, stageH - height - 8)),
      };
    });
    const changed = windows.some((w, i) => {
      const old = this.snap.windows[i];
      return w.x !== old.x || w.y !== old.y || w.w !== old.w || w.h !== old.h;
    });
    if (changed) this.emit({ windows });
  }

  openApp(appId: AppId, explorerPath?: string, layout?: Partial<Pick<WindowRecord, 'x' | 'y' | 'w' | 'h'>>) {
    const existing = this.snap.windows.find((w) => w.appId === appId && !w.minimized);
    const any = this.snap.windows.find((w) => w.appId === appId);
    if (any) {
      this.focus(any.id);
      if (any.minimized) this.toggleMin(any.id);
      if (explorerPath && (appId === 'explorer' || appId === 'thispc')) {
        this.updateWindow(any.id, {
          explorerPath,
          explorerHistory: [...(any.explorerHistory ?? [any.explorerPath ?? HOME]), explorerPath],
          explorerIndex: (any.explorerIndex ?? 0) + 1,
        });
      }
      return;
    }
    if (existing) {
      this.focus(existing.id);
      return;
    }
    this.z += 1;
    const meta = APP_META[appId];
    const mobile = typeof window !== 'undefined' && window.innerWidth < 720;
    const id = `w-${appId}-${Date.now()}`;
    const path = explorerPath ?? (appId === 'thispc' ? 'C:\\' : HOME);
    const win: WindowRecord = {
      id,
      appId,
      title: meta.title,
      x: layout?.x ?? (mobile ? 0 : 48 + (this.snap.windows.length % 6) * 28),
      y: layout?.y ?? (mobile ? 0 : 36 + (this.snap.windows.length % 6) * 22),
      w: mobile ? Math.min(window.innerWidth, meta.w) : (layout?.w ?? meta.w),
      h: mobile ? Math.max(280, window.innerHeight - LAB_BAR_H - LAB_DOCK_H) : (layout?.h ?? meta.h),
      z: this.z,
      minimized: false,
      maximized: mobile,
      explorerPath: path,
      explorerHistory: [path],
      explorerIndex: 0,
      explorerView: 'grid',
    };
    this.emit({ windows: [...this.snap.windows, win], focusedId: id, startOpen: false });
    playTone('ui', this.snap.settings.sound);
  }

  closeWindow(id: string) {
    const windows = this.snap.windows.filter((w) => w.id !== id);
    this.emit({
      windows,
      focusedId: windows.length ? windows.reduce((a, b) => (a.z > b.z ? a : b)).id : null,
    });
  }

  focus(id: string) {
    this.z += 1;
    this.emit({
      focusedId: id,
      startOpen: false,
      contextMenu: null,
      windows: this.snap.windows.map((w) => (w.id === id ? { ...w, z: this.z, minimized: false } : w)),
    });
  }

  toggleMin(id: string) {
    const win = this.snap.windows.find((w) => w.id === id);
    if (!win) return;
    if (this.snap.focusedId === id && !win.minimized) {
      this.emit({
        windows: this.snap.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
        focusedId: this.snap.windows.filter((w) => w.id !== id && !w.minimized).sort((a, b) => b.z - a.z)[0]?.id ?? null,
      });
      return;
    }
    this.focus(id);
  }

  toggleMax(id: string) {
    this.emit({
      windows: this.snap.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          const r = w.restore ?? { x: 64, y: 48, w: APP_META[w.appId].w, h: APP_META[w.appId].h };
          return { ...w, maximized: false, ...r };
        }
        return { ...w, maximized: true, restore: { x: w.x, y: w.y, w: w.w, h: w.h } };
      }),
    });
    this.focus(id);
  }

  moveWindow(id: string, x: number, y: number) {
    this.emit({
      windows: this.snap.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    });
  }

  resizeWindow(id: string, w: number, h: number) {
    this.emit({
      windows: this.snap.windows.map((win) => (win.id === id ? { ...win, w, h } : win)),
    });
  }

  updateWindow(id: string, patch: Partial<WindowRecord>) {
    this.emit({
      windows: this.snap.windows.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    });
  }

  toggleStart(open?: boolean) {
    this.emit({ startOpen: open ?? !this.snap.startOpen, contextMenu: null });
  }

  setContextMenu(menu: OSSnapshot['contextMenu']) {
    this.emit({ contextMenu: menu });
  }

  setRenaming(id: string | null) {
    this.emit({ renamingId: id });
  }

  run(raw: string): { output: string; error?: boolean; clear?: boolean } {
    const cwdBefore = this.snap.cwd;
    const { result, cwd } = executeCommand(raw, this.snap.vfs, this.snap.cwd);
    if (result.exit) {
      const term = this.snap.windows.find((w) => w.appId === 'terminal');
      if (term) this.closeWindow(term.id);
      return { output: '' };
    }
    const lastCommand: LastCommand = {
      raw,
      name: result.commandName ?? '',
      args: result.args ?? [],
      output: result.output,
      error: Boolean(result.error),
      cwdBefore,
      cwdAfter: cwd,
      createdFolder: result.createdFolder,
      createdFile: result.createdFile,
      listed: result.listed,
      renamed: result.renamed,
      copied: result.copied,
      moved: result.moved,
      deleted: result.deleted,
    };
    const stepEvents = raw.trim() ? recordCommand(this.snap.stepEvents, lastCommand) : this.snap.stepEvents;
    this.snap.cwd = cwd;
    this.emit({ cwd, lastCommand, stepEvents, vfs: this.snap.vfs });
    this.afterVfs(
      {
        ranCommand: Boolean(raw.trim()),
        listed: result.listed,
        createdFile: result.createdFile,
        createdFolder: result.createdFolder,
        copied: result.copied,
        deleted: result.deleted,
      },
      true,
    );
    if (result.error) playTone('error', this.snap.settings.sound);
    return { output: result.output, error: result.error, clear: result.clear };
  }

  continueTutorial() {
    const progress = this.snap.progress;
    if (!progress.onboardingComplete) {
      if (this.snap.onboardingPage < 1) {
        this.emit({ onboardingPage: 1, highlightTerminal: true });
        return;
      }
      const lesson = lessonById(progress.currentLessonId) ?? firstLesson();
      const env = buildLessonEnvironment(lesson);
      const nextProgress = {
        ...progress,
        onboardingComplete: true,
        currentLessonId: lesson.id,
        currentStepIndex: 0,
        revealedAnswerStepId: null,
      };
      this.emit({
        progress: nextProgress,
        vfs: env.vfs,
        cwd: env.cwd,
        activeEnvId: `lesson:${lesson.id}`,
        onboardingPage: 0,
        coach: null,
        stepEvents: { ...EMPTY_EVENTS },
        ...this.tutorialFlags(nextProgress),
      });
      return;
    }
    const lesson = activeLesson(progress);
    const step = activeStep(progress);
    if (isLessonCompleteView(progress)) {
      this.goNextLesson();
      return;
    }
    if (step && isInteractiveKind(step.kind) && !progress.completedStepIds.includes(step.id)) return;
    if (step?.kind === 'question' && !progress.completedStepIds.includes(step.id)) return;
    const nextIndex = progress.currentStepIndex + 1;
    if (nextIndex >= lesson.steps.length) {
      this.completeLesson();
      return;
    }
    const nextProgress = { ...progress, currentStepIndex: nextIndex, revealedAnswerStepId: null };
    this.emit({
      progress: nextProgress,
      coach: null,
      questionWrong: null,
      stepEvents: { ...EMPTY_EVENTS },
      lastCommand: null,
      ...this.tutorialFlags(nextProgress),
    });
  }

  private completeLesson() {
    const lesson = activeLesson(this.snap.progress);
    let progress = this.snap.progress;
    if (!progress.completedLessonIds.includes(lesson.id)) {
      progress = {
        ...progress,
        completedLessonIds: [...progress.completedLessonIds, lesson.id],
        currentStepIndex: lesson.steps.length,
      };
      progress = this.applyXp(progress, xpKey(['lesson', lesson.id, 'complete']), lesson.xp);
      progress = this.finishProgress(progress);
      this.toast('ok', 'Lesson complete', lesson.title);
    } else {
      progress = { ...progress, currentStepIndex: lesson.steps.length };
    }
    this.emit({ progress, coach: null, highlightTerminal: false, awaitingInput: false });
  }

  goNextLesson() {
    const lesson = activeLesson(this.snap.progress);
    const next = nextLesson(lesson.id);
    if (!next) {
      this.emit({ awaitingInput: false, highlightTerminal: false });
      return;
    }
    this.startLesson(next.id, 'fresh');
  }

  /**
   * 'fresh' starts the lesson from step one on a clean scenario disk.
   * 'rebuild' keeps step progress but restores the lesson's files, used when the
   * disk currently belongs to some other lesson or mission.
   */
  startLesson(id: string, mode: 'fresh' | 'rebuild' = 'fresh') {
    const lesson = lessonById(id) ?? firstLesson();
    const env = buildLessonEnvironment(lesson);
    const fresh = mode === 'fresh';
    const stepIds = new Set(lesson.steps.map((s) => s.id));
    const progress: UserProgress = {
      ...this.snap.progress,
      currentLessonId: lesson.id,
      currentStepIndex: fresh ? 0 : this.snap.progress.currentStepIndex,
      academyTab: 'learn',
      activeMissionId: null,
      revealedAnswerStepId: null,
      completedStepIds: fresh
        ? this.snap.progress.completedStepIds.filter((sid) => !stepIds.has(sid))
        : this.snap.progress.completedStepIds,
      hintLevelByStep: fresh
        ? Object.fromEntries(Object.entries(this.snap.progress.hintLevelByStep).filter(([sid]) => !stepIds.has(sid)))
        : this.snap.progress.hintLevelByStep,
      showedAnswerIds: fresh
        ? this.snap.progress.showedAnswerIds.filter((sid) => !stepIds.has(sid))
        : this.snap.progress.showedAnswerIds,
    };
    this.emit({
      vfs: env.vfs,
      cwd: env.cwd,
      progress,
      activeEnvId: `lesson:${lesson.id}`,
      coach: null,
      lastCommand: null,
      questionWrong: null,
      stepEvents: { ...EMPTY_EVENTS },
      ...this.tutorialFlags(progress),
    });
  }

  /**
   * Called when the lab route opens. Refreshing mid-lesson must not touch the disk,
   * so this only rebuilds when the saved environment belongs to something else.
   */
  enterLesson(id: string) {
    const lesson = lessonById(id);
    if (!lesson) return;
    const envId = `lesson:${lesson.id}`;
    if (this.snap.activeEnvId === envId && this.snap.progress.currentLessonId === lesson.id) {
      if (this.snap.progress.academyTab !== 'learn' || this.snap.progress.activeMissionId) {
        this.emit({ progress: { ...this.snap.progress, academyTab: 'learn', activeMissionId: null } });
      }
      return;
    }
    const sameLesson = this.snap.progress.currentLessonId === lesson.id;
    const midway = sameLesson && this.snap.progress.currentStepIndex > 0;
    this.startLesson(lesson.id, midway ? 'rebuild' : 'fresh');
  }

  /** Open a mission: fresh scenario disk, mission mode, nothing pre-solved. */
  startMission(id: string) {
    const mission = missionById(id);
    if (!mission) return;
    const env = buildEnvironment(mission.setup, mission.startCwd);
    const progress: UserProgress = {
      ...this.snap.progress,
      academyTab: 'missions',
      activeMissionId: mission.id,
      revealedAnswerStepId: null,
    };
    this.emit({
      vfs: env.vfs,
      cwd: env.cwd,
      progress,
      activeEnvId: `mission:${mission.id}`,
      coach: null,
      lastCommand: null,
      stepEvents: { ...EMPTY_EVENTS },
      awaitingInput: true,
      highlightTerminal: true,
    });
  }

  /** Called when the mission route opens. A refresh keeps the scenario as it stands. */
  enterMission(id: string) {
    const mission = missionById(id);
    if (!mission) return;
    if (this.snap.activeEnvId === `mission:${id}` && this.snap.progress.activeMissionId === id) return;
    this.startMission(id);
  }

  restartMission() {
    const id = this.snap.progress.activeMissionId;
    if (!id) return;
    this.startMission(id);
    this.toast('info', 'Mission scenario reset');
  }

  restartLesson() {
    this.startLesson(this.snap.progress.currentLessonId, 'fresh');
    this.toast('info', 'Lesson restarted');
  }

  retryStep() {
    this.emit({ coach: null, questionWrong: null, lastCommand: null });
  }

  revealHint() {
    const step = activeStep(this.snap.progress);
    if (!step?.hints?.length) return;
    const current = this.snap.progress.hintLevelByStep[step.id] ?? 0;
    if (current >= step.hints.length) return;
    this.emit({
      progress: {
        ...this.snap.progress,
        hintLevelByStep: { ...this.snap.progress.hintLevelByStep, [step.id]: current + 1 },
      },
    });
  }

  /** Reveal the current step's answer. Never types it, never completes the step. */
  showAnswer() {
    const step = activeStep(this.snap.progress);
    if (!stepSupportsAnswer(step) || !step) return;
    const ledger = this.snap.progress.showedAnswerIds.includes(step.id)
      ? this.snap.progress.showedAnswerIds
      : [...this.snap.progress.showedAnswerIds, step.id];
    this.emit({
      progress: { ...this.snap.progress, showedAnswerIds: ledger, revealedAnswerStepId: step.id },
    });
  }

  /** Put the answer away again. The help ledger stays, so XP cannot be toggled. */
  hideAnswer() {
    if (!this.snap.progress.revealedAnswerStepId) return;
    this.emit({ progress: { ...this.snap.progress, revealedAnswerStepId: null } });
  }

  /** Bring the Terminal forward and put the cursor in it. Does not run anything. */
  focusTerminal() {
    this.openApp('terminal');
    const term = this.snap.windows.find((w) => w.appId === 'terminal');
    if (term?.minimized) this.toggleMin(term.id);
    this.emit({ terminalFocusNonce: this.snap.terminalFocusNonce + 1 });
  }

  answerQuestion(choiceId: string) {
    const step = activeStep(this.snap.progress);
    if (!step?.question) return;
    if (this.snap.progress.completedStepIds.includes(step.id)) return;
    if (choiceId !== step.question.correctId) {
      this.emit({
        questionWrong: choiceId,
        coach: { tone: 'try', title: 'Try again', body: step.question.explanation },
      });
      return;
    }
    const lesson = activeLesson(this.snap.progress);
    let progress: UserProgress = {
      ...this.snap.progress,
      completedStepIds: [...this.snap.progress.completedStepIds, step.id],
    };
    progress = this.awardStepXp(progress, lesson.id, step.id, step.xp ?? 10);
    progress = this.finishProgress(progress);
    this.emit({
      progress,
      questionWrong: null,
      coach: { tone: 'ok', title: 'Correct', body: step.question.explanation },
    });
  }

  setAcademyTab(tab: AcademyTab) {
    this.emit({
      progress: { ...this.snap.progress, academyTab: tab },
      coach: tab === 'learn' ? this.snap.coach : null,
    });
  }

  setActiveMission(id: string | null) {
    this.emit({ progress: { ...this.snap.progress, academyTab: 'missions', activeMissionId: id } });
    this.evaluateTutorial(false);
  }

  explorerNewFolder(parentPath: string) {
    const parent = this.snap.vfs.findByPath(parentPath);
    if (!parent || parent.type !== 'folder') {
      this.toast('error', 'The system cannot find the path specified.');
      return;
    }
    let name = 'New folder';
    let n = 2;
    while (this.snap.vfs.findChild(parent.id, name)) {
      name = `New folder (${n})`;
      n += 1;
    }
    const made = this.snap.vfs.mkdir(parentPath, name);
    if (!made.ok) {
      this.toast('error', made.message);
      return;
    }
    const node = this.snap.vfs.findByPath(made.path);
    this.afterVfs({ ranCommand: false, createdFolder: true }, true);
    if (node) this.emit({ renamingId: node.id });
  }

  explorerRename(id: string, name: string) {
    const node = this.snap.vfs.get(id);
    if (!node) return;
    const parent = node.parentId ? this.snap.vfs.nodePath(node.parentId) : HOME;
    const result = this.snap.vfs.rename(parent, node.name, name.trim() || node.name);
    this.emit({ renamingId: null });
    if (!result.ok) {
      this.toast('error', result.message);
      return;
    }
    this.afterVfs({ ranCommand: false }, true);
  }

  explorerDelete(id: string) {
    const result = this.snap.vfs.recycleNode(id);
    if (!result.ok) {
      this.toast('error', result.message);
      return;
    }
    this.afterVfs({ ranCommand: false, deleted: true }, true);
    this.toast('info', 'Moved to Recycle Bin');
  }

  explorerCopy(id: string) {
    const node = this.snap.vfs.get(id);
    if (!node || node.type !== 'file' || !node.parentId) return;
    const parent = this.snap.vfs.nodePath(node.parentId);
    const dest = `${parent}\\${node.name.replace(/(\.[^.]+)?$/, '-copy$1')}`;
    const copied = this.snap.vfs.copy(parent, node.name, dest);
    if (!copied.ok) {
      this.toast('error', copied.message);
      return;
    }
    this.afterVfs({ ranCommand: false, copied: true }, true);
    this.toast('ok', 'File copied');
  }

  restoreRecycle(index: number) {
    const result = this.snap.vfs.restore(index);
    if (!result.ok) {
      this.toast('error', result.message);
      return;
    }
    this.afterVfs({ ranCommand: false }, true);
    this.toast('ok', 'Restored', result.path);
  }

  purgeRecycle(index: number) {
    this.snap.vfs.purge(index);
    this.afterVfs({ ranCommand: false }, false);
  }

  emptyRecycle() {
    this.snap.vfs.emptyRecycle();
    this.afterVfs({ ranCommand: false }, false);
    this.toast('info', 'Recycle Bin emptied');
  }

  patchSettings(patch: Partial<SettingsState>) {
    this.emit({ settings: { ...this.snap.settings, ...patch } });
  }

  askConfirm(confirm: ConfirmState) {
    this.emit({ confirm });
  }

  cancelConfirm() {
    this.emit({ confirm: null });
  }

  runConfirm() {
    const fn = this.snap.confirm?.onConfirm;
    this.emit({ confirm: null });
    fn?.();
  }

  /** Wipe the simulated disk back to whatever the current lesson or mission expects. */
  resetVfs() {
    const missionId = this.snap.progress.activeMissionId;
    const mission = missionId ? missionById(missionId) : undefined;
    const env = mission
      ? buildEnvironment(mission.setup, mission.startCwd)
      : buildLessonEnvironment(activeLesson(this.snap.progress));
    this.emit({
      vfs: env.vfs,
      cwd: env.cwd,
      contextMenu: null,
      lastCommand: null,
      stepEvents: { ...EMPTY_EVENTS },
    });
    this.toast('info', 'Simulated filesystem reset');
  }

  resetProgress() {
    const lesson = firstLesson();
    const env = buildLessonEnvironment(lesson);
    this.emit({
      progress: { ...DEFAULT_PROGRESS, currentLessonId: lesson.id },
      vfs: env.vfs,
      cwd: env.cwd,
      activeEnvId: `lesson:${lesson.id}`,
      coach: null,
      lastCommand: null,
      stepEvents: { ...EMPTY_EVENTS },
      onboardingPage: 0,
      awaitingInput: false,
      highlightTerminal: false,
    });
    this.toast('info', 'Progress reset');
  }

  exportProgress(): string {
    return exportState(this.persistPayload());
  }

  importProgress(raw: string) {
    const parsed = parseImported(raw);
    if (!parsed) {
      this.toast('error', 'That file is not a Terminal Space save.');
      return;
    }
    this.emit({
      vfs: new VirtualFileSystem(parsed.vfs),
      cwd: parsed.cwd,
      progress: parsed.progress,
      settings: parsed.settings,
      activeEnvId: parsed.activeEnvId ?? `lesson:${parsed.progress.currentLessonId}`,
      phase: 'desktop',
      ...this.tutorialFlags(parsed.progress),
    });
    this.toast('ok', 'Progress imported');
  }

  resetCurrentMission() {
    this.askConfirm({
      title: 'Restart this lesson?',
      body: 'The virtual disk returns to this lesson’s starting folders. XP you already earned stays. Steps in this lesson reset.',
      confirmLabel: 'Restart lesson',
      danger: true,
      onConfirm: () => this.restartLesson(),
    });
  }

  completeFromExplorer() {
    this.afterVfs({ ranCommand: false }, true);
  }

  autocomplete(partial: string): string | null {
    const [cmd, ...rest] = partial.split(/\s+/);
    if (!rest.length && !partial.endsWith(' ')) {
      const hits = COMMAND_NAMES.filter((n) => n.startsWith(cmd.toLowerCase()));
      return hits.length === 1 ? hits[0] : hits[0] ?? null;
    }
    const prefix = rest[rest.length - 1] ?? '';
    const hits = this.snap.vfs.completions(this.snap.cwd, prefix);
    if (!hits.length) return null;
    const rebuilt = [...(rest.slice(0, -1)), hits[0]];
    return `${cmd} ${rebuilt.join(' ')}`;
  }

  resolvedTheme(): 'dark' | 'light' {
    if (this.snap.settings.appearance !== 'system') return this.snap.settings.appearance;
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  playerLevel() {
    return levelFromXp(this.snap.progress.xp);
  }

  terminalButtonState(): 'open' | 'restore' | 'focus' | 'hidden' {
    const term = this.snap.windows.find((w) => w.appId === 'terminal');
    if (!term) return 'open';
    if (term.minimized) return 'restore';
    if (this.snap.focusedId === term.id) return 'hidden';
    return 'focus';
  }
}

export const os = new OSStore();
