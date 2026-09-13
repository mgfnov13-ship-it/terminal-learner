import { useEffect, useRef, useState } from 'react';
import type { PersistedState, UserProgress } from '../../types';
import { loadLegacyState } from '../../engine/storage';
import { os } from '../../engine/osStore';
import { useAuth } from '../auth/useAuth';
import { LegacyImportModal } from '../migration/LegacyImportModal';
import { computeProgressDiff, isDiffEmpty } from './diff';
import { getProgressRepository } from './progressRepository';
import { reconcileProgress } from './reconcile';

type SyncStatus = 'idle' | 'hydrating' | 'awaiting_migration' | 'ready';

function resolvedKey(userId: string) {
  return `terminal-space-migration-resolved:${userId}`;
}

function isMigrationResolved(userId: string): boolean {
  try {
    return localStorage.getItem(resolvedKey(userId)) === '1';
  } catch {
    return true; // fail safe: never re-prompt if storage is unavailable
  }
}

function markMigrationResolved(userId: string) {
  try {
    localStorage.setItem(resolvedKey(userId), '1');
  } catch {
    // ignore
  }
}

/**
 * Mounted once near the root, alongside AuthProvider. Owns the HYDRATING -> AWAITING_MIGRATION
 * -> READY state machine described in the plan: on every sign-in/sign-out it switches OSStore's
 * storage namespace, resolves any legacy on-device progress against the account's cloud
 * progress, and only then starts mirroring new local changes outward. No outbound Supabase
 * writes happen before status is READY.
 */
export function ProgressSyncController() {
  const { user, isConfigured } = useAuth();
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [pendingLegacy, setPendingLegacy] = useState<PersistedState | null>(null);
  const activeUserId = useRef<string | null | undefined>(undefined);
  const lastSeen = useRef<UserProgress | null>(null);
  const syncing = useRef(false);

  const userId = isConfigured ? (user?.id ?? null) : null;

  useEffect(() => {
    if (userId === activeUserId.current) return;
    activeUserId.current = userId;
    setPendingLegacy(null);
    lastSeen.current = null;

    if (!userId) {
      // Signed out, or unconfigured/dev guest mode — back to the shared local/guest namespace.
      os.rehydrateForUser(null);
      setStatus('idle');
      return;
    }

    let cancelled = false;
    setStatus('hydrating');
    os.rehydrateForUser(userId);

    const legacyBlob = loadLegacyState();
    if (legacyBlob && !isMigrationResolved(userId)) {
      setPendingLegacy(legacyBlob);
      setStatus('awaiting_migration');
      return;
    }

    finishHydration(userId, os.getSnapshot().progress).catch(() => {
      if (!cancelled) setStatus('ready'); // stay usable locally even if the cloud read failed
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function finishHydration(forUserId: string, base: UserProgress) {
    const repo = await getProgressRepository();
    const cloud = await repo.loadCloudProgress(forUserId);
    if (activeUserId.current !== forUserId) return; // switched accounts again while this was in flight
    const reconciled = reconcileProgress(base, cloud);
    const merged: UserProgress = { ...base, ...reconciled };
    os.hydrateProgress(merged);
    lastSeen.current = merged;
    setStatus('ready');
  }

  function handleImport() {
    if (!userId || !pendingLegacy) return;
    markMigrationResolved(userId);
    const legacyProgress = pendingLegacy.progress;
    setPendingLegacy(null);
    setStatus('hydrating');
    finishHydration(userId, legacyProgress);
  }

  function handleStartFresh() {
    if (!userId) return;
    markMigrationResolved(userId);
    setPendingLegacy(null);
    setStatus('hydrating');
    finishHydration(userId, os.getSnapshot().progress);
  }

  // Only mirrors outward once READY — never before migration is resolved (Non-negotiable: no
  // outbound writes during HYDRATING/AWAITING_MIGRATION).
  useEffect(() => {
    if (status !== 'ready' || !userId) return;
    const unsubscribe = os.subscribe(() => {
      if (syncing.current || !lastSeen.current) return;
      const current = os.getSnapshot().progress;
      const diff = computeProgressDiff(lastSeen.current, current);
      if (isDiffEmpty(diff)) return;
      syncing.current = true;
      getProgressRepository()
        .then((repo) => repo.mirrorNewEntries(userId, diff))
        .then(() => {
          lastSeen.current = current; // only advance the baseline once the mirror actually succeeded
        })
        .catch((err) => {
          console.error('Terminal Space: could not sync progress to your account, will retry.', err);
        })
        .finally(() => {
          syncing.current = false;
        });
    });
    return () => {
      unsubscribe();
    };
  }, [status, userId]);

  if (pendingLegacy) {
    return <LegacyImportModal legacy={pendingLegacy} onImport={handleImport} onStartFresh={handleStartFresh} />;
  }
  return null;
}
