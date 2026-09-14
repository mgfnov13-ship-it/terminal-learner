import { describe, expect, it } from 'vitest';
import { authErrorCopy, classifyAuthMessage } from './authErrors';

describe('authErrors', () => {
  it('maps credential failures to one non-enumerating message', () => {
    expect(classifyAuthMessage('Invalid login credentials')).toBe('invalid_credentials');
    expect(authErrorCopy('Invalid login credentials').en).toMatch(/couldn’t log you in/i);
  });

  it('never echoes an unknown SDK string', () => {
    const copy = authErrorCopy('PostgrestException: secret stack');
    expect(copy.en).toBe('Something went wrong. Try again.');
    expect(copy.en).not.toMatch(/Postgrest|secret/i);
  });

  it('classifies network, rate limit, and unconfirmed email', () => {
    expect(classifyAuthMessage('Failed to fetch')).toBe('network');
    expect(classifyAuthMessage('rate limit exceeded')).toBe('rate_limited');
    expect(classifyAuthMessage('Email not confirmed')).toBe('email_not_confirmed');
  });
});
