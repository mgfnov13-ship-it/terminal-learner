import type { MissionContext, UserProgress } from '../types';
import { currentMission, levelFromXp } from '../data/missions';
import { newlyUnlocked } from '../data/achievements';

export interface ProgressDelta {
  progress: UserProgress;
  completedMissionId?: string;
  xpGained: number;
  leveledUpTo?: number;
  achievements: string[];
}

export function applyCommandFlags(
  progress: UserProgress,
  flags: {
    listed?: boolean;
    createdFile?: boolean;
    createdFolder?: boolean;
    copied?: boolean;
    deleted?: boolean;
    ranCommand: boolean;
  },
): UserProgress {
  return {
    ...progress,
    commandCount: progress.commandCount + (flags.ranCommand ? 1 : 0),
    listedDirectories: progress.listedDirectories || Boolean(flags.listed),
    createdFile: progress.createdFile || Boolean(flags.createdFile),
    createdFolder: progress.createdFolder || Boolean(flags.createdFolder),
    copiedFile: progress.copiedFile || Boolean(flags.copied),
    deletedItem: progress.deletedItem || Boolean(flags.deleted),
  };
}

export function evaluateProgress(progress: UserProgress, ctx: MissionContext): ProgressDelta {
  const beforeLevel = levelFromXp(progress.xp);
  let next = { ...progress, completedMissionIds: [...progress.completedMissionIds] };
  let xpGained = 0;
  let completedMissionId: string | undefined;
  for (let i = 0; i < 12; i += 1) {
    const mission = currentMission(next.completedMissionIds);
    if (!mission?.check(ctx)) break;
    next.completedMissionIds.push(mission.id);
    next.xp += mission.xp;
    xpGained += mission.xp;
    completedMissionId = mission.id;
  }
  const unlocked = newlyUnlocked(next);
  if (unlocked.length) {
    next.unlockedAchievementIds = [
      ...next.unlockedAchievementIds,
      ...unlocked.map((a) => a.id),
    ];
  }
  const afterLevel = levelFromXp(next.xp);
  return {
    progress: next,
    completedMissionId,
    xpGained,
    leveledUpTo: afterLevel > beforeLevel ? afterLevel : undefined,
    achievements: unlocked.map((a) => a.id),
  };
}
