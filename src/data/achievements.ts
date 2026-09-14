import type { AchievementDef, UserProgress } from '../types';
import { MISSIONS } from './missions';
import { FILES_TRACK, trackLessons } from './tracks';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-command',
    title: 'First Command',
    description: 'Run a command in Terminal.',
    category: 'Terminal',
    check: (p) => p.commandCount >= 1,
  },
  {
    id: 'twenty-commands',
    title: 'Getting Fluent',
    description: 'Run 20 commands.',
    category: 'Terminal',
    check: (p) => p.commandCount >= 20,
  },
  {
    id: 'organizer',
    title: 'Organizer',
    description: 'Create a folder.',
    category: 'Files',
    check: (p) => p.createdFolder,
  },
  {
    id: 'file-explorer',
    title: 'File Maker',
    description: 'Create a file on the virtual disk.',
    category: 'Files',
    check: (p) => p.createdFile,
  },
  {
    id: 'copy-master',
    title: 'Copy Master',
    description: 'Copy a file.',
    category: 'Files',
    check: (p) => p.copiedFile,
  },
  {
    id: 'cleanup',
    title: 'Cleanup',
    description: 'Delete a file or folder.',
    category: 'Files',
    check: (p) => p.deletedItem,
  },
  {
    id: 'rookie',
    title: 'Terminal Rookie',
    description: 'Finish your first lesson.',
    category: 'Learning',
    check: (p) => p.completedLessonIds.length >= 1,
  },
  {
    id: 'navigator',
    title: 'Navigator',
    description: 'Finish the Finding Your Way unit.',
    category: 'Learning',
    check: (p) =>
      (FILES_TRACK.units.find((u) => u.id === 'files-u2')?.lessonIds ?? []).every((id) =>
        p.completedLessonIds.includes(id),
      ),
  },
  {
    id: 'five-lessons',
    title: 'Five Down',
    description: 'Finish 5 lessons.',
    category: 'Learning',
    check: (p) => p.completedLessonIds.length >= 5,
  },
  {
    id: 'first-mission',
    title: 'On The Job',
    description: 'Complete a mission.',
    category: 'Missions',
    check: (p) => p.completedMissionIds.length >= 1,
  },
  {
    id: 'mission-veteran',
    title: 'Mission Veteran',
    description: 'Complete 3 missions.',
    category: 'Missions',
    check: (p) => p.completedMissionIds.length >= 3,
  },
  {
    id: 'mission-complete',
    title: 'Field Ready',
    description: 'Complete every mission.',
    category: 'Missions',
    check: (p) => MISSIONS.every((m) => p.completedMissionIds.includes(m.id)),
  },
  {
    id: 'unaided',
    title: 'On Your Own',
    description: 'Finish a lesson without revealing an answer.',
    category: 'Mastery',
    check: (p) => p.completedLessonIds.length >= 1 && p.showedAnswerIds.length === 0,
  },
  {
    id: 'apprentice',
    title: 'Files Apprentice',
    description: 'Finish every built lesson in the Files track.',
    category: 'Mastery',
    check: (p) => trackLessons(FILES_TRACK).every((l) => p.completedLessonIds.includes(l.id)),
  },
];

export function newlyUnlocked(progress: UserProgress): AchievementDef[] {
  return ACHIEVEMENTS.filter(
    (a) => !progress.unlockedAchievementIds.includes(a.id) && a.check(progress),
  );
}

export function achievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export interface AchievementProgress {
  current: number;
  target: number;
}

/**
 * Numeric progress toward an achievement, derived from real progress data — never fabricated.
 * Only returns a value for achievements where a natural running count exists; binary
 * achievements (run a command, create a folder, finish unaided...) return null and the UI shows
 * no progress bar for them, per spec: don't fabricate progress where it doesn't make sense.
 */
export function achievementProgress(achievement: AchievementDef, progress: UserProgress): AchievementProgress | null {
  switch (achievement.id) {
    case 'twenty-commands':
      return { current: Math.min(progress.commandCount, 20), target: 20 };
    case 'five-lessons':
      return { current: Math.min(progress.completedLessonIds.length, 5), target: 5 };
    case 'mission-veteran':
      return { current: Math.min(progress.completedMissionIds.length, 3), target: 3 };
    case 'mission-complete':
      return { current: progress.completedMissionIds.length, target: MISSIONS.length };
    case 'navigator': {
      const ids = FILES_TRACK.units.find((u) => u.id === 'files-u2')?.lessonIds ?? [];
      return { current: ids.filter((id) => progress.completedLessonIds.includes(id)).length, target: ids.length };
    }
    case 'apprentice': {
      const lessons = trackLessons(FILES_TRACK);
      return {
        current: lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length,
        target: lessons.length,
      };
    }
    default:
      return null;
  }
}
