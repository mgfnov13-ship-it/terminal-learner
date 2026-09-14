/**
 * Only ever allow redirecting back to a path inside this app. Rejects anything that could send a
 * visitor off-site after auth: protocol-relative "//host", absolute URLs, javascript:, backslash
 * variants, %5c, control characters, and post-auth loops onto another auth screen.
 */
import { safeSessionStorageGet, safeSessionStorageRemove, safeSessionStorageSet } from '../../lib/storageSafe';

const AUTH_LOOP_PATHS = new Set([
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/auth/callback',
]);

const POST_AUTH_KEY = 'ts_post_auth_path';

export function isAuthLoopPath(pathname: string): boolean {
  return AUTH_LOOP_PATHS.has(normalizeAppPath(pathname));
}

export function normalizeAppPath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname || '/';
}

export function sanitizeRedirect(raw: string | null, fallback = '/app'): string {
  if (!raw) return fallback;
  if (/\\|%5c/i.test(raw) || /[\x00-\x1f]/.test(raw)) return fallback;
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const resolved = new URL(raw, origin);
    if (resolved.origin !== origin) return fallback;
    if (isAuthLoopPath(resolved.pathname)) return fallback;
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}

/** Forwards `?redirect=` across sign-in ↔ sign-up ↔ forgot without re-sanitizing yet. */
export function crossAuthLink(path: '/auth/sign-in' | '/auth/sign-up' | '/auth/forgot-password'): string {
  if (typeof window === 'undefined') return path;
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  return redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;
}

export function persistPostAuthPath(path: string): void {
  const safe = sanitizeRedirect(path);
  safeSessionStorageSet(POST_AUTH_KEY, safe);
}

export function consumePostAuthPath(fallback = '/app'): string {
  const stored = safeSessionStorageGet(POST_AUTH_KEY);
  safeSessionStorageRemove(POST_AUTH_KEY);
  return sanitizeRedirect(stored, fallback);
}
