import type { AchievementDef, UserProgress } from '../types';
import { MISSIONS } from './missions';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-command',
    title: 'First Command',
    description: 'Run a command in Terminal.',
    check: (p) => p.commandCount >= 1,
  },
  {
    id: 'file-explorer',
    title: 'File Maker',
    description: 'Create a file on the virtual disk.',
    check: (p) => p.createdFile,
  },
  {
    id: 'organizer',
    title: 'Organizer',
    description: 'Create a folder.',
    check: (p) => p.createdFolder,
  },
  {
    id: 'copy-master',
    title: 'Copy Master',
    description: 'Copy a file.',
    check: (p) => p.copiedFile,
  },
  {
    id: 'cleanup',
    title: 'Cleanup',
    description: 'Delete a file or folder.',
    check: (p) => p.deletedItem,
  },
  {
    id: 'rookie',
    title: 'Terminal Rookie',
    description: 'Complete 5 missions.',
    check: (p) => p.completedMissionIds.length >= 5,
  },
  {
    id: 'apprentice',
    title: 'Terminal Apprentice',
    description: 'Finish every Files mission.',
    check: (p) => MISSIONS.filter((m) => m.levelId === 1).every((m) => p.completedMissionIds.includes(m.id)),
  },
];

export function newlyUnlocked(progress: UserProgress): AchievementDef[] {
  return ACHIEVEMENTS.filter(
    (a) => !progress.unlockedAchievementIds.includes(a.id) && a.check(progress),
  );
}
