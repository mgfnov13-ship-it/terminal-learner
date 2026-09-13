import type { LessonDef, SetupOp } from '../types/tutorial';
import { HOME, baseName, joinPath, parentPath, splitPath } from './paths';
import { VirtualFileSystem } from './virtualFileSystem';

export function ensureFolder(vfs: VirtualFileSystem, path: string): void {
  const parts = splitPath(path);
  if (parts.length <= 1) return;
  for (let i = 1; i < parts.length; i += 1) {
    const next = joinPath(parts.slice(0, i + 1));
    if (!vfs.findByPath(next)) {
      vfs.mkdir(parentPath(next), parts[i]);
    }
  }
}

export function ensureFile(vfs: VirtualFileSystem, path: string, content = ''): void {
  ensureFolder(vfs, parentPath(path));
  if (vfs.findByPath(path)) return;
  vfs.writeFile(parentPath(path), baseName(path), content);
}

export function applySetupOps(vfs: VirtualFileSystem, ops: SetupOp[]): string | null {
  let cwd: string | null = null;
  for (const op of ops) {
    if (op.type === 'ensureFolder') ensureFolder(vfs, op.path);
    else if (op.type === 'ensureFile') ensureFile(vfs, op.path, op.content);
    else cwd = op.path;
  }
  return cwd;
}

/** A clean simulated disk plus whatever folders and files a lesson or mission needs. */
export function buildEnvironment(setup: SetupOp[], startCwd?: string): { vfs: VirtualFileSystem; cwd: string } {
  const vfs = VirtualFileSystem.seed();
  const setupCwd = applySetupOps(vfs, setup);
  return { vfs, cwd: setupCwd ?? startCwd ?? HOME };
}

export function buildLessonEnvironment(lesson: LessonDef): { vfs: VirtualFileSystem; cwd: string } {
  return buildEnvironment(lesson.setup, lesson.startCwd);
}
