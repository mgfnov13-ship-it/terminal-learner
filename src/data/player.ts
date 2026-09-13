/** Player progression: XP and Player Level. Deliberately separate from track/course progress. */

export const XP_THRESHOLDS = [0, 500, 1000, 1750, 2500];

export const MAX_PLAYER_LEVEL = XP_THRESHOLDS.length;

export function levelFromXp(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i += 1) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, MAX_PLAYER_LEVEL);
}

export function nextThreshold(xp: number): number | null {
  return XP_THRESHOLDS.find((n) => n > xp) ?? null;
}

/** Progress towards the next player level, 0–1. Returns 1 at max level. */
export function levelProgress(xp: number): number {
  const next = nextThreshold(xp);
  if (next === null) return 1;
  const floor = XP_THRESHOLDS[levelFromXp(xp) - 1] ?? 0;
  return Math.max(0, Math.min(1, (xp - floor) / (next - floor)));
}
