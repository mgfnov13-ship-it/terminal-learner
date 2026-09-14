import type { CloudProgressSnapshot } from './reconcile';

export interface ProgressDiff {
  newStepIds: { stepId: string; lessonId: string }[];
  newLessonIds: string[];
  newMissionIds: string[];
  newAchievementIds: string[];
  newXpEvents: { key: string; amount: number }[];
  currentLessonId: string | null;
  settings: {
    theme: string;
    reducedMotion: boolean;
    lessonHints: boolean;
    language?: string;
    textScale?: string;
    highContrast?: boolean;
  } | null;
}

export interface ProgressRepository {
  /** Reads back everything cloud-synced for this account, or null for a brand-new account. */
  loadCloudProgress(userId: string): Promise<CloudProgressSnapshot | null>;
  /** Best-effort, non-blocking mirror of newly-observed local progress. Never throws. */
  mirrorNewEntries(userId: string, diff: ProgressDiff): Promise<void>;
}

export const EMPTY_DIFF: ProgressDiff = {
  newStepIds: [],
  newLessonIds: [],
  newMissionIds: [],
  newAchievementIds: [],
  newXpEvents: [],
  currentLessonId: null,
  settings: null,
};

export function isDiffEmpty(diff: ProgressDiff): boolean {
  return (
    diff.newStepIds.length === 0 &&
    diff.newLessonIds.length === 0 &&
    diff.newMissionIds.length === 0 &&
    diff.newAchievementIds.length === 0 &&
    diff.newXpEvents.length === 0 &&
    !diff.currentLessonId &&
    !diff.settings
  );
}

/** Selects the Supabase-backed repository once configured, otherwise a local no-op. */
export async function getProgressRepository(): Promise<ProgressRepository> {
  const { isSupabaseConfigured } = await import('../../lib/supabase/client');
  if (!isSupabaseConfigured) {
    const { localProgressRepository } = await import('./progressRepository.local');
    return localProgressRepository;
  }
  const { supabaseProgressRepository } = await import('./progressRepository.supabase');
  return supabaseProgressRepository;
}
