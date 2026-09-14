import { describe, expect, it } from 'vitest';
import { consumePostAuthPath, persistPostAuthPath, sanitizeRedirect } from './redirect';

describe('sanitizeRedirect', () => {
  it('passes through a genuine internal path and keeps query and hash', () => {
    expect(sanitizeRedirect('/app/lab/files/files-3?x=1#y')).toBe('/app/lab/files/files-3?x=1#y');
  });

  it('falls back to /app for a missing value', () => {
    expect(sanitizeRedirect(null)).toBe('/app');
    expect(sanitizeRedirect('')).toBe('/app');
  });

  it('rejects a protocol-relative redirect', () => {
    expect(sanitizeRedirect('//evil.example')).toBe('/app');
  });

  it('rejects an absolute URL to another host', () => {
    expect(sanitizeRedirect('https://evil.example/phish')).toBe('/app');
  });

  it('rejects a javascript: pseudo-URL', () => {
    expect(sanitizeRedirect('javascript:alert(1)')).toBe('/app');
  });

  it('rejects the backslash and %5c bypasses', () => {
    expect(sanitizeRedirect('/\\evil.example')).toBe('/app');
    expect(sanitizeRedirect('/\\/evil.example')).toBe('/app');
    expect(sanitizeRedirect('/%5cevil.example')).toBe('/app');
  });

  it('rejects auth-loop destinations', () => {
    expect(sanitizeRedirect('/auth/sign-in')).toBe('/app');
    expect(sanitizeRedirect('/auth/callback?code=abc')).toBe('/app');
  });

  it('respects a custom fallback', () => {
    expect(sanitizeRedirect('//evil.example', '/tracks')).toBe('/tracks');
  });

  it('consumes a persisted post-auth path once', () => {
    persistPostAuthPath('/app/learn/files');
    expect(consumePostAuthPath()).toBe('/app/learn/files');
    expect(consumePostAuthPath('/app')).toBe('/app');
  });
});
