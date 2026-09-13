import type { UserProgress } from '../types';
import type { LessonDef } from '../types/tutorial';
import { ACHIEVEMENTS, newlyUnlocked } from '../data/achievements';
import { levelFromXp } from '../data/player';

export function xpKey(parts: string[]): string {
  return parts.join(':');
}

export function awardXp(
  progress: UserProgress,
  key: string,
  amount: number,
): { progress: UserProgress; gained: number } {
  if (amount <= 0 || progress.awardedXpKeys.includes(key)) {
    return { progress, gained: 0 };
  }
  const next: UserProgress = {
    ...progress,
    xp: progress.xp + amount,
    awardedXpKeys: [...progress.awardedXpKeys, key],
  };
  return { progress: next, gained: amount };
}

export function applyAchievements(progress: UserProgress): { progress: UserProgress; achievements: string[] } {
  const unlocked = newlyUnlocked(progress);
  if (!unlocked.length) return { progress, achievements: [] };
  return {
    progress: {
      ...progress,
      unlockedAchievementIds: [...progress.unlockedAchievementIds, ...unlocked.map((a) => a.id)],
    },
    achievements: unlocked.map((a) => a.id),
  };
}

export function describeAchievement(id: string): string {
  return ACHIEVEMENTS.find((a) => a.id === id)?.title ?? id;
}

/** What this lesson has actually paid out: step XP, unaided bonuses, and the lesson award. */
export function lessonXpEarned(progress: UserProgress, lesson: LessonDef): number {
  const steps = lesson.steps.reduce((total, step) => {
    if (!progress.completedStepIds.includes(step.id)) return total;
    const base = step.xp ?? 0;
    const bonus = progress.showedAnswerIds.includes(step.id) ? 0 : Math.ceil(base * 0.2);
    return total + base + bonus;
  }, 0);
  const lessonAward = progress.completedLessonIds.includes(lesson.id) ? lesson.xp : 0;
  return steps + lessonAward;
}

export function leveledUp(beforeXp: number, afterXp: number): number | undefined {
  const before = levelFromXp(beforeXp);
  const after = levelFromXp(afterXp);
  return after > before ? after : undefined;
}
