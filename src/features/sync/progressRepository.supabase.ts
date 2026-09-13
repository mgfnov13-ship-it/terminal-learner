import { supabase } from '../../lib/supabase/client';
import type { CloudProgressSnapshot } from './reconcile';
import type { ProgressDiff, ProgressRepository } from './progressRepository';

/**
 * Real, but only ever exercised once a live Supabase project is connected (Phase 20 — see the
 * plan's "Configured Supabase" verification section). Reads/writes the tables defined in
 * supabase/migrations/0001_init.sql. Every write is scoped to the caller's own account by RLS;
 * this module never uses a service-role key.
 */
export const supabaseProgressRepository: ProgressRepository = {
  async loadCloudProgress(userId: string): Promise<CloudProgressSnapshot | null> {
    const [steps, lessons, missions, achievements, xpEvents, currentLesson] = await Promise.all([
      supabase.from('user_step_completion').select('step_id').eq('user_id', userId),
      supabase.from('user_lesson_completion').select('lesson_id').eq('user_id', userId),
      supabase.from('user_mission_completion').select('mission_id').eq('user_id', userId),
      supabase.from('user_achievement').select('achievement_id').eq('user_id', userId),
      supabase.from('user_xp_events').select('event_key, amount').eq('user_id', userId),
      supabase.from('user_current_lesson').select('lesson_id').eq('user_id', userId).maybeSingle(),
    ]);

    const anyProgress =
      (steps.data?.length ?? 0) > 0 ||
      (lessons.data?.length ?? 0) > 0 ||
      (xpEvents.data?.length ?? 0) > 0 ||
      Boolean(currentLesson.data);
    if (!anyProgress) return null;

    return {
      completedStepIds: (steps.data ?? []).map((r) => r.step_id),
      completedLessonIds: (lessons.data ?? []).map((r) => r.lesson_id),
      completedMissionIds: (missions.data ?? []).map((r) => r.mission_id),
      unlockedAchievementIds: (achievements.data ?? []).map((r) => r.achievement_id),
      xpEventKeys: (xpEvents.data ?? []).map((r) => r.event_key),
      xpTotal: (xpEvents.data ?? []).reduce((sum, r) => sum + r.amount, 0),
      currentLessonId: currentLesson.data?.lesson_id ?? null,
      onboardingComplete: false, // canonical value lives on `profiles`, read separately by AuthProvider
    };
  },

  async mirrorNewEntries(userId: string, diff: ProgressDiff): Promise<void> {
    // Intentionally does not swallow errors: the sync orchestrator (progressSync.ts) only
    // advances its "already synced" baseline after this resolves, so a thrown error here is
    // what makes the same diff get retried on the next tick instead of being silently dropped.
    const writes: PromiseLike<unknown>[] = [];

      if (diff.newStepIds.length) {
        writes.push(
          supabase
            .from('user_step_completion')
            .upsert(
              diff.newStepIds.map(({ stepId, lessonId }) => ({ user_id: userId, step_id: stepId, lesson_id: lessonId })),
              { onConflict: 'user_id,step_id', ignoreDuplicates: true },
            ),
        );
      }
      if (diff.newLessonIds.length) {
        writes.push(
          supabase
            .from('user_lesson_completion')
            .upsert(
              diff.newLessonIds.map((lessonId) => ({ user_id: userId, lesson_id: lessonId })),
              { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
            ),
        );
      }
      if (diff.newMissionIds.length) {
        writes.push(
          supabase
            .from('user_mission_completion')
            .upsert(
              diff.newMissionIds.map((missionId) => ({ user_id: userId, mission_id: missionId })),
              { onConflict: 'user_id,mission_id', ignoreDuplicates: true },
            ),
        );
      }
      if (diff.newAchievementIds.length) {
        writes.push(
          supabase
            .from('user_achievement')
            .upsert(
              diff.newAchievementIds.map((achievementId) => ({ user_id: userId, achievement_id: achievementId })),
              { onConflict: 'user_id,achievement_id', ignoreDuplicates: true },
            ),
        );
      }
      if (diff.newXpEvents.length) {
        writes.push(
          supabase
            .from('user_xp_events')
            .upsert(
              diff.newXpEvents.map(({ key, amount }) => ({ user_id: userId, event_key: key, amount })),
              { onConflict: 'user_id,event_key', ignoreDuplicates: true },
            ),
        );
      }
      if (diff.currentLessonId) {
        writes.push(
          supabase
            .from('user_current_lesson')
            .upsert({ user_id: userId, lesson_id: diff.currentLessonId, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }),
        );
      }
      if (diff.settings) {
        writes.push(
          supabase.from('user_settings').upsert(
            {
              user_id: userId,
              theme: diff.settings.theme,
              reduced_motion: diff.settings.reducedMotion,
              lesson_hints: diff.settings.lessonHints,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          ),
        );
      }

      await Promise.all(writes);
  },
};
