/**
 * Only ever allow redirecting back to a path inside this app. Rejects anything that could send a
 * visitor off-site after auth (protocol-relative "//host", absolute URLs, javascript: etc.).
 */
export function sanitizeRedirect(raw: string | null, fallback = '/app'): string {
  if (!raw) return fallback;
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback;
  if (raw.includes('://')) return fallback;
  return raw;
}
