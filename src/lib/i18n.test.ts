import { describe, expect, it } from 'vitest';
import { MESSAGE_KEYS, message, type Language } from './i18n';

const langs: Language[] = ['ar', 'en'];

describe('i18n catalog', () => {
  it('has a non-empty string for every key in both languages', () => {
    for (const lang of langs) {
      for (const key of MESSAGE_KEYS) {
        const value = message(lang, key);
        expect(value.length, `${lang}:${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('does not leave Arabic using the English string for chrome keys', () => {
    const englishOnly = MESSAGE_KEYS.filter((key) => message('ar', key) === message('en', key));
    expect(englishOnly).toEqual([]);
  });
});
