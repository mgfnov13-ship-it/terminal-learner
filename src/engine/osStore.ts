import type {
  AppId,
  ConfirmState,
  PersistedState,
  SettingsState,
  ToastItem,
  UserProgress,
  WindowRecord,
} from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { currentMission, levelFromXp } from '../data/missions';
import { COMMAND_NAMES, executeCommand } from './commandParser';
import { HOME } from './paths';
import { applyCommandFlags, evaluateProgress } from './progress';
import { playTone } from './sound';
import {
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  exportState,
  loadState,
  parseImported,
  saveState,
} from './storage';
import { VirtualFileSystem } from './virtualFileSystem';

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
}

const APP_META: Record<AppId, { title: string; w: number; h: number }> = {
  terminal: { title: 'Terminal', w: 640, h: 420 },
  explorer: { title: 'File Explorer', w: 780, h: 500 },
  thispc: { title: 'This PC', w: 780, h: 500 },
  recycle: { title: 'Recycle Bin', w: 560, h: 400 },
  academy: { title: 'Academy', w: 420, h: 560 },
  settings: { title: 'Settings', w: 520, h: 520 },
  help: { title: 'Help', w: 520, h: 480 },
};

function defaultWindows(): WindowRecord[] {
  return [];
}

function hydrate(): OSSnapshot {
  const saved = loadState();
  const vfs = saved ? new VirtualFileSystem(saved.vfs) : VirtualFileSystem.seed();
  return {
    vfs,
    cwd: saved?.cwd ?? HOME,
    progress: saved?.progress ?? { ...DEFAULT_PROGRESS },
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

  private afterVfs(flags: Parameters<typeof applyCommandFlags>[1]) {
    const progress = applyCommandFlags(this.snap.progress, flags);
    const delta = evaluateProgress(progress, {
      vfs: this.snap.vfs,
      cwd: this.snap.cwd,
      listedDirectories: progress.listedDirectories,
    });
    const patch: Partial<OSSnapshot> = { progress: delta.progress, vfs: this.snap.vfs };
    if (delta.xpGained) {
      patch.xpBurst = delta.xpGained;
      this.toast('xp', `+${delta.xpGained} XP`);
      playTone('xp', this.snap.settings.sound);
    }
    if (delta.completedMissionId) {
      const nextMission = currentMission(delta.progress.completedMissionIds);
      this.toast('ok', 'Mission complete', nextMission ? `Next: ${nextMission.title}` : 'Files track finished.');
      playTone('ok', this.snap.settings.sound);
    }
    if (delta.leveledUpTo) {
      patch.levelBurst = delta.leveledUpTo;
      this.toast('ok', `Level ${delta.leveledUpTo}`);
    }
    for (const id of delta.achievements) {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) this.toast('achievement', 'Achievement unlocked', def.title);
    }
    this.emit(patch);
    if (delta.xpGained) window.setTimeout(() => this.emit({ xpBurst: 0 }), 1400);
    if (delta.leveledUpTo) window.setTimeout(() => this.emit({ levelBurst: null }), 1800);
  }

  finishWelcome() {
    this.emit({ phase: 'boot' });
  }

  finishBoot() {
    this.emit({ phase: 'desktop' });
    window.setTimeout(() => this.openApp('academy'), 240);
  }

  skipBoot() {
    this.finishBoot();
  }

  openApp(appId: AppId, explorerPath?: string) {
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
      x: mobile ? 0 : 48 + (this.snap.windows.length % 6) * 28,
      y: mobile ? 0 : 36 + (this.snap.windows.length % 6) * 22,
      w: mobile ? Math.min(window.innerWidth, meta.w) : meta.w,
      h: mobile ? Math.max(280, window.innerHeight - 56) : meta.h,
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
    const { result, cwd } = executeCommand(raw, this.snap.vfs, this.snap.cwd);
    if (result.exit) {
      const term = this.snap.windows.find((w) => w.appId === 'terminal');
      if (term) this.closeWindow(term.id);
      return { output: '' };
    }
    this.snap.cwd = cwd;
    this.snap.vfs = this.snap.vfs;
    this.afterVfs({
      ranCommand: Boolean(raw.trim()),
      listed: result.listed,
      createdFile: result.createdFile,
      createdFolder: result.createdFolder,
      copied: result.copied,
      deleted: result.deleted,
    });
    if (result.error) playTone('error', this.snap.settings.sound);
    return { output: result.output, error: result.error, clear: result.clear };
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
    this.afterVfs({ ranCommand: false, createdFolder: true });
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
    this.afterVfs({ ranCommand: false });
  }

  explorerDelete(id: string) {
    const result = this.snap.vfs.recycleNode(id);
    if (!result.ok) {
      this.toast('error', result.message);
      return;
    }
    this.afterVfs({ ranCommand: false, deleted: true });
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
    this.afterVfs({ ranCommand: false, copied: true });
    this.toast('ok', 'File copied');
  }

  restoreRecycle(index: number) {
    const result = this.snap.vfs.restore(index);
    if (!result.ok) {
      this.toast('error', result.message);
      return;
    }
    this.afterVfs({ ranCommand: false });
    this.toast('ok', 'Restored', result.path);
  }

  purgeRecycle(index: number) {
    this.snap.vfs.purge(index);
    this.afterVfs({ ranCommand: false });
  }

  emptyRecycle() {
    this.snap.vfs.emptyRecycle();
    this.afterVfs({ ranCommand: false });
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

  resetVfs() {
    this.emit({ vfs: VirtualFileSystem.seed(), cwd: HOME, contextMenu: null });
    this.toast('info', 'Virtual computer reset');
  }

  resetProgress() {
    this.emit({
      progress: { ...DEFAULT_PROGRESS },
      vfs: VirtualFileSystem.seed(),
      cwd: HOME,
    });
    this.toast('info', 'Progress reset');
  }

  exportProgress(): string {
    return exportState(this.persistPayload());
  }

  importProgress(raw: string) {
    const parsed = parseImported(raw);
    if (!parsed) {
      this.toast('error', 'That file is not a Terminal Academy save.');
      return;
    }
    this.emit({
      vfs: new VirtualFileSystem(parsed.vfs),
      cwd: parsed.cwd,
      progress: parsed.progress,
      settings: parsed.settings,
      phase: 'desktop',
    });
    this.toast('ok', 'Progress imported');
  }

  resetCurrentMission() {
    const mission = currentMission(this.snap.progress.completedMissionIds);
    if (!mission) {
      this.toast('info', 'No active mission to reset.');
      return;
    }
    this.toast('info', `Still on ${mission.title}. Change the files to match the objective.`);
  }

  completeFromExplorer() {
    this.afterVfs({ ranCommand: false });
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
}

export const os = new OSStore();
