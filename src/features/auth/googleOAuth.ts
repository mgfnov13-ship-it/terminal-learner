import { safeSessionStorageGet, safeSessionStorageRemove, safeSessionStorageSet } from '../../lib/storageSafe';

const STARTED_AT = 'ts_google_oauth_started_at';
const TIMEOUT_MS = 60_000;

export function markGoogleOAuthPending(): void {
  safeSessionStorageSet(STARTED_AT, String(Date.now()));
}

export function clearGoogleOAuthPending(): void {
  safeSessionStorageRemove(STARTED_AT);
}

export function hasPendingGoogleOAuth(): boolean {
  const raw = safeSessionStorageGet(STARTED_AT);
  if (!raw) return false;
  const started = Number(raw);
  if (!Number.isFinite(started) || Date.now() - started > TIMEOUT_MS) {
    clearGoogleOAuthPending();
    return false;
  }
  return true;
}
