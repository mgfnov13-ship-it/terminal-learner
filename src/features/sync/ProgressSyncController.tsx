import { useEffect, useRef, useState } from 'react';
import type { PersistedState, SettingsState, UserProgress } from '../../types';
import { loadLegacyState } from '../../engine/storage';
import { os } from '../../engine/osStore';
import { useAuth } from '../auth/useAuth';
import { LegacyImportModal } from '../migration/LegacyImportModal';
import { computeProgressDiff, isDiffEmpty } from './diff';
import { getProgressRepository } from './progressRepository';
import { reconcileProgress } from './reconcile';
import { setSyncStatus } from './syncStatusStore';

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
  const lastSeenSettings = useRef<SettingsState | null>(null);
  const syncing = useRef(false);

  const userId = isConfigured ? (user?.id ?? null) : null;

  // Local/guest mode has no cloud save to report on — the indicator only appears once configured.
  useEffect(() => {
    if (!userId) {
      setSyncStatus('idle');
      return;
    }
    setSyncStatus(status === 'ready' ? 'ready' : 'hydrating');
  }, [status, userId]);

  useEffect(() => {
    if (userId === activeUserId.current) return;
    activeUserId.current = userId;
    setPendingLegacy(null);
    lastSeen.current = null;
    lastSeenSettings.current = null;

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

    // Cloud settings win over a timestamp-less legacy/local value when they already exist; when
    // they don't, the local value stands and seeds the cloud on the next outbound sync tick.
    if (cloud?.settings) {
      os.patchSettings({
        appearance: cloud.settings.theme,
        reducedMotion: cloud.settings.reducedMotion,
        showHints: cloud.settings.lessonHints,
        ...(cloud.settings.language ? { language: cloud.settings.language } : {}),
        ...(cloud.settings.textScale ? { textScale: cloud.settings.textScale } : {}),
        ...(cloud.settings.highContrast != null ? { highContrast: cloud.settings.highContrast } : {}),
      });
    }
    lastSeenSettings.current = os.getSnapshot().settings;

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
      const snap = os.getSnapshot();
      const current = snap.progress;
      const currentSettings = snap.settings;
      const diff = computeProgressDiff(lastSeen.current, current, lastSeenSettings.current ?? undefined, currentSettings);
      if (isDiffEmpty(diff)) return;
      syncing.current = true;
      getProgressRepository()
        .then((repo) => repo.mirrorNewEntries(userId, diff))
        .then(() => {
          // Only advance the baseline once the mirror actually succeeded, so a failure retries
          // the same diff next tick instead of silently dropping it.
          lastSeen.current = current;
          lastSeenSettings.current = currentSettings;
          setSyncStatus('ready');
        })
        .catch((err) => {
          console.error('Terminal Space: could not sync progress to your account, will retry.', err);
          setSyncStatus('retrying');
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
