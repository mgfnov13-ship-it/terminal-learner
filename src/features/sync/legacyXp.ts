import { lessonById } from '../../data/curriculum';
import { missionById } from '../../data/missions';

export interface LegacyXpEvent {
  key: string;
  amount: number;
}

/**
 * Recovers the XP amount a legacy `awardedXpKeys` entry represents by looking its source back
 * up in curriculum/mission data (the local client only ever stored the key, never the amount).
 * Returns null when the key's shape isn't recognized or its source no longer exists.
 */
export function deriveAmountForKey(key: string): number | null {
  const parts = key.split(':');
  if (parts[0] === 'step' && parts.length >= 3) {
    const [, lessonId, stepId, suffix] = parts;
    const step = lessonById(lessonId)?.steps.find((s) => s.id === stepId);
    if (!step) return null;
    const base = step.xp ?? 0;
    return suffix === 'unaided' ? Math.ceil(base * 0.2) : base;
  }
  if (parts[0] === 'lesson' && parts[2] === 'complete') {
    return lessonById(parts[1])?.xp ?? null;
  }
  if (parts[0] === 'mission') {
    return missionById(parts[1])?.xp ?? null;
  }
  return null;
}

/**
 * Converts a legacy local XP ledger (keys + a running total, no per-key amounts) into
 * `user_xp_events` rows. Every key converts at its derivable amount, or 0 when it can't be
 * reconstructed; the gap between the reconstructed sum and the legacy total is preserved as one
 * stable, idempotent balancing event so re-running an import never double-counts XP.
 */
export function convertLegacyXp(awardedXpKeys: string[], legacyTotalXp: number, fingerprint: string): LegacyXpEvent[] {
  const events: LegacyXpEvent[] = awardedXpKeys.map((key) => ({ key, amount: deriveAmountForKey(key) ?? 0 }));
  const reconstructed = events.reduce((sum, e) => sum + e.amount, 0);
  const residual = legacyTotalXp - reconstructed;
  if (residual > 0) {
    events.push({ key: `legacy-import-balance:${fingerprint}`, amount: residual });
  }
  return events;
}
