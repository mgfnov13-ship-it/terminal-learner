import type { UserProgress } from '../../types';
import { deriveAmountForKey } from './legacyXp';

export function unionStrings(a: string[], b: string[]): string[] {
  return Array.from(new Set([...a, ...b]));
}

/** The account-progress fields as read back from Supabase — never includes device-local attempt state. */
export interface CloudProgressSnapshot {
  completedStepIds: string[];
  completedLessonIds: string[];
  completedMissionIds: string[];
  unlockedAchievementIds: string[];
  xpEventKeys: string[];
  xpTotal: number;
  currentLessonId: string | null;
  onboardingComplete: boolean;
  /** null when the account has no stored settings yet — the caller then seeds the cloud from local. */
  settings: {
    theme: 'dark' | 'light' | 'system';
    reducedMotion: boolean;
    lessonHints: boolean;
    language?: 'ar' | 'en';
    textScale?: 'standard' | 'large' | 'larger';
    highContrast?: boolean;
  } | null;
}

export interface ReconciledAccountProgress {
  completedStepIds: string[];
  completedLessonIds: string[];
  completedMissionIds: string[];
  unlockedAchievementIds: string[];
  awardedXpKeys: string[];
  xp: number;
  currentLessonId: string;
  onboardingComplete: boolean;
}

/**
 * Merges local (device) account-progress fields with the cloud snapshot, per the plan's
 * reconciliation rules:
 *  - additive id/key arrays: set union
 *  - XP: cloud's total plus only the *new* keys' derived amounts — never two pre-aggregated
 *    totals added together, so it can't double-count anything already represented server-side
 *  - current-lesson pointer: cloud wins whenever the cloud account already has any progress
 *  - onboardingComplete: boolean OR
 * Device-local attempt fields (step index, hints, revealed answers, VFS) are deliberately not
 * inputs here — they carry over untouched on the same device.
 */
export function reconcileProgress(local: UserProgress, cloud: CloudProgressSnapshot | null): ReconciledAccountProgress {
  if (!cloud) {
    return {
      completedStepIds: local.completedStepIds,
      completedLessonIds: local.completedLessonIds,
      completedMissionIds: local.completedMissionIds,
      unlockedAchievementIds: local.unlockedAchievementIds,
      awardedXpKeys: local.awardedXpKeys,
      xp: local.xp,
      currentLessonId: local.currentLessonId,
      onboardingComplete: local.onboardingComplete,
    };
  }

  const hasCloudProgress =
    cloud.completedLessonIds.length > 0 || cloud.completedStepIds.length > 0 || cloud.xpEventKeys.length > 0;

  const cloudKeys = new Set(cloud.xpEventKeys);
  const newLocalKeys = local.awardedXpKeys.filter((key) => !cloudKeys.has(key));
  const newLocalXp = newLocalKeys.reduce((sum, key) => sum + (deriveAmountForKey(key) ?? 0), 0);

  return {
    completedStepIds: unionStrings(local.completedStepIds, cloud.completedStepIds),
    completedLessonIds: unionStrings(local.completedLessonIds, cloud.completedLessonIds),
    completedMissionIds: unionStrings(local.completedMissionIds, cloud.completedMissionIds),
    unlockedAchievementIds: unionStrings(local.unlockedAchievementIds, cloud.unlockedAchievementIds),
    awardedXpKeys: unionStrings(local.awardedXpKeys, cloud.xpEventKeys),
    xp: cloud.xpTotal + newLocalXp,
    currentLessonId: hasCloudProgress && cloud.currentLessonId ? cloud.currentLessonId : local.currentLessonId,
    onboardingComplete: local.onboardingComplete || cloud.onboardingComplete,
  };
}
