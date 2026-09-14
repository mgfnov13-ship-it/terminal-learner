import { useSyncExternalStore } from 'react';

/**
 * A tiny standalone pub/sub (same shape as OSStore's own subscribe/getSnapshot idiom) so any
 * component — the app nav's save-status indicator, in particular — can read the current sync
 * state without ProgressSyncController needing to wrap the whole tree in a context provider.
 */
export type SyncStatusValue = 'idle' | 'hydrating' | 'ready' | 'retrying';

let current: SyncStatusValue = 'idle';
const listeners = new Set<() => void>();

export function getSyncStatus(): SyncStatusValue {
  return current;
}

export function setSyncStatus(next: SyncStatusValue) {
  if (current === next) return;
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useSyncStatus(): SyncStatusValue {
  return useSyncExternalStore(subscribe, getSyncStatus, getSyncStatus);
}
