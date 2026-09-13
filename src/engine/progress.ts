import type { MissionContext, UserProgress } from '../types';
import { MISSIONS } from '../data/missions';
import { applyAchievements } from './xp';

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

export function evaluatePracticeMission(
  progress: UserProgress,
  ctx: MissionContext,
): { progress: UserProgress; completedMissionId?: string } {
  if (progress.academyTab !== 'missions' || !progress.activeMissionId) {
    return { progress };
  }
  const mission = MISSIONS.find((m) => m.id === progress.activeMissionId);
  if (!mission || progress.completedMissionIds.includes(mission.id)) return { progress };
  if (!mission.check(ctx)) return { progress };
  return {
    progress: {
      ...progress,
      completedMissionIds: [...progress.completedMissionIds, mission.id],
      activeMissionId: null,
    },
    completedMissionId: mission.id,
  };
}

export function withAchievements(progress: UserProgress): { progress: UserProgress; achievements: string[] } {
  return applyAchievements(progress);
}
