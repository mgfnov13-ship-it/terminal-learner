import type { MissionDef } from '../types';
import { HOME } from '../engine/paths';
import type { VirtualFileSystem } from '../engine/virtualFileSystem';

function at(vfs: VirtualFileSystem, path: string) {
  return vfs.findByPath(path);
}

function isFolder(vfs: VirtualFileSystem, path: string) {
  return at(vfs, path)?.type === 'folder';
}

function isFile(vfs: VirtualFileSystem, path: string) {
  return at(vfs, path)?.type === 'file';
}

const P = `${HOME}\\Projects`;

export const MISSIONS: MissionDef[] = [
  {
    id: 'l1-m1',
    levelId: 1,
    order: 1,
    title: 'Create Projects',
    briefing: 'Every lab needs a place for work. Make a folder named Projects in your home directory.',
    objective: 'A folder named Projects exists in C:\\Users\\Student',
    hint: 'Folders are created with mkdir. You are already in Student.',
    xp: 50,
    check: ({ vfs }) => isFolder(vfs, P),
  },
  {
    id: 'l1-m2',
    levelId: 1,
    order: 2,
    title: 'Explore',
    briefing: 'Look around. List whatever is in the folder you are standing in.',
    objective: 'List the contents of the current directory from Terminal.',
    hint: 'dir prints a Windows-style listing. ls works here too.',
    xp: 40,
    check: ({ listedDirectories }) => listedDirectories,
  },
  {
    id: 'l1-m3',
    levelId: 1,
    order: 3,
    title: 'Enter Projects',
    briefing: 'Walk into the folder you just made. The prompt should show you are inside Projects.',
    objective: 'Current directory is C:\\Users\\Student\\Projects',
    hint: 'cd changes folders. cd .. climbs out.',
    xp: 40,
    check: ({ cwd }) => cwd.toLowerCase() === P.toLowerCase(),
  },
  {
    id: 'l1-m4',
    levelId: 1,
    order: 4,
    title: 'Create Notes',
    briefing: 'Leave a file behind so the folder is not empty.',
    objective: 'notes.txt exists inside Projects.',
    hint: 'touch notes.txt, or type nul > notes.txt',
    xp: 50,
    check: ({ vfs }) => isFile(vfs, `${P}\\notes.txt`),
  },
  {
    id: 'l1-m5',
    levelId: 1,
    order: 5,
    title: 'Create Multiple Files',
    briefing: 'Three more files, same folder: game, school, and ideas.',
    objective: 'game.txt, school.txt, and ideas.txt exist in Projects.',
    hint: 'Repeat the create step three times. Names matter.',
    xp: 100,
    check: ({ vfs }) =>
      isFile(vfs, `${P}\\game.txt`) && isFile(vfs, `${P}\\school.txt`) && isFile(vfs, `${P}\\ideas.txt`),
  },
  {
    id: 'l1-m6',
    levelId: 1,
    order: 6,
    title: 'Rename',
    briefing: 'ideas.txt needs a clearer name.',
    objective: 'ideas.txt is now project-ideas.txt inside Projects.',
    hint: 'ren old.txt new.txt',
    xp: 75,
    check: ({ vfs }) => isFile(vfs, `${P}\\project-ideas.txt`) && !isFile(vfs, `${P}\\ideas.txt`),
  },
  {
    id: 'l1-m7',
    levelId: 1,
    order: 7,
    title: 'Copy',
    briefing: 'Keep a spare of game.txt without touching the original.',
    objective: 'game-copy.txt exists in Projects, and game.txt is still there.',
    hint: 'copy source.txt destination.txt',
    xp: 75,
    check: ({ vfs }) => isFile(vfs, `${P}\\game.txt`) && isFile(vfs, `${P}\\game-copy.txt`),
  },
  {
    id: 'l1-m8',
    levelId: 1,
    order: 8,
    title: 'Create Games Folder',
    briefing: 'Game files belong together. Make a Games folder, then put game.txt in it.',
    objective: 'Projects\\Games exists and contains game.txt.',
    hint: 'mkdir then move.',
    xp: 100,
    check: ({ vfs }) => isFolder(vfs, `${P}\\Games`) && isFile(vfs, `${P}\\Games\\game.txt`),
  },
  {
    id: 'l1-m9',
    levelId: 1,
    order: 9,
    title: 'Delete',
    briefing: 'school.txt is leftover. Remove it.',
    objective: 'school.txt is gone from Projects.',
    hint: 'del filename.txt',
    xp: 75,
    check: ({ vfs }) => !isFile(vfs, `${P}\\school.txt`),
  },
  {
    id: 'l1-m10',
    levelId: 1,
    order: 10,
    title: 'Organize',
    briefing:
      'Put the lab in order. Notes should live in a Notes folder. Games should hold game.txt. Create anything that is missing.',
    objective: 'Projects\\Notes\\notes.txt exists, and Projects\\Games\\game.txt exists.',
    hint: 'mkdir, move, and create can all be used. End state is what counts.',
    xp: 150,
    check: ({ vfs }) => isFile(vfs, `${P}\\Notes\\notes.txt`) && isFile(vfs, `${P}\\Games\\game.txt`),
  },
  {
    id: 'l1-m11',
    levelId: 1,
    order: 11,
    title: 'Cleanup',
    briefing: 'The Notes folder was a draft. Remove that folder.',
    objective: 'Projects\\Notes no longer exists.',
    hint: 'rmdir fails if the folder still has files. Empty it first, or use rmdir /s.',
    xp: 100,
    check: ({ vfs }) => !isFolder(vfs, `${P}\\Notes`),
  },
  {
    id: 'l1-m12',
    levelId: 1,
    order: 12,
    title: 'Final Challenge',
    briefing:
      'Build a small project tree from memory. Name the root FinalProject. Inside it: README.txt, ideas.txt, and code.txt. Rename ideas.txt to project-ideas.txt. Add an Archive folder and place a copy of README.txt in it.',
    objective:
      'FinalProject contains README.txt, project-ideas.txt, code.txt, and Archive\\README.txt.',
    hint: 'Home or Projects both count. The tree is what we check, not the keystrokes.',
    xp: 300,
    check: ({ vfs }) => {
      const roots = [`${HOME}\\FinalProject`, `${P}\\FinalProject`];
      return roots.some((root) => {
        return (
          isFile(vfs, `${root}\\README.txt`) &&
          isFile(vfs, `${root}\\project-ideas.txt`) &&
          isFile(vfs, `${root}\\code.txt`) &&
          isFolder(vfs, `${root}\\Archive`) &&
          isFile(vfs, `${root}\\Archive\\README.txt`) &&
          !isFile(vfs, `${root}\\ideas.txt`)
        );
      });
    },
  },
];

export const LEVELS = [
  { id: 1, name: 'Files', subtitle: 'Folders, names, copies, and cleanup.', lockedUntilXp: 0, implemented: true },
  { id: 2, name: 'Applications', subtitle: 'Install and remove (coming later).', lockedUntilXp: 500, implemented: false },
  { id: 3, name: 'System', subtitle: 'Machine info and settings (coming later).', lockedUntilXp: 1000, implemented: false },
  { id: 4, name: 'Networking', subtitle: 'Simulated network commands (coming later).', lockedUntilXp: 1750, implemented: false },
  { id: 5, name: 'Advanced', subtitle: 'Longer terminal workflows (coming later).', lockedUntilXp: 2500, implemented: false },
];

export const XP_THRESHOLDS = [0, 500, 1000, 1750, 2500];

export function levelFromXp(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i += 1) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, 5);
}

export function nextThreshold(xp: number): number | null {
  const next = XP_THRESHOLDS.find((n) => n > xp);
  return next ?? null;
}

export function currentMission(completed: string[]): MissionDef | undefined {
  return MISSIONS.find((m) => !completed.includes(m.id));
}

export function missionsForLevel(levelId: number): MissionDef[] {
  return MISSIONS.filter((m) => m.levelId === levelId);
}
