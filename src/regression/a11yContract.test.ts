import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LiveRegion } from '../components/UI/Feedback';
import { MESSAGE_KEYS, message } from '../lib/i18n';
import { sanitizeRedirect } from '../features/auth/redirect';

function readSource(relative: string): string {
  return readFileSync(new URL(relative, import.meta.url), 'utf8');
}

const pagesCss = readSource('../styles/pages.css');
const indexCss = readSource('../index.css');
const tokensCss = readSource('../../tokens.css');

describe('a11y contracts', () => {
  it('exports a polite live region', () => {
    expect(typeof LiveRegion).toBe('function');
  });

  it('localizes chrome keys in both languages', () => {
    expect(message('en', 'skip')).toMatch(/Skip/i);
    expect(message('ar', 'skip').length).toBeGreaterThan(0);
    expect(MESSAGE_KEYS.includes('accessibility')).toBe(true);
  });

  it('keeps post-auth redirects on-site', () => {
    expect(sanitizeRedirect('/app')).toBe('/app');
    expect(sanitizeRedirect('https://evil.example')).toBe('/app');
  });

  it('defines a skip-link that becomes visible on focus', () => {
    expect(pagesCss).toMatch(/\.skip-link\s*\{/);
    expect(pagesCss).toMatch(/\.skip-link:focus\s*\{[\s\S]*env\(safe-area-inset-top/);
  });

  it('uses :focus-visible for interactive controls', () => {
    expect(indexCss).toMatch(/button:focus-visible/);
    expect(indexCss).toMatch(/input:focus-visible/);
  });

  it('keeps numbered FAQ bodies full-width when they have no index column', () => {
    expect(pagesCss).toMatch(/\.numbered > \.numbered-body:only-child/);
  });

  it('mirrors chrome with logical CSS and RTL arrows', () => {
    expect(indexCss).toMatch(/\[dir="rtl"\] \.dir-arrow/);
    expect(indexCss).toMatch(/inset-inline-end/);
    expect(pagesCss).toMatch(/text-align:\s*start/);
  });

  it('collapses public chrome below phone width without a desktop-only breakpoint', () => {
    expect(pagesCss).toMatch(/@media \(max-width: 47\.99rem\)/);
    expect(pagesCss).toMatch(/\.site-nav-menu/);
    expect(indexCss).toMatch(/\.lab-panes/);
  });

  it('honors both OS and in-app reduced motion', () => {
    expect(tokensCss).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)/);
    expect(tokensCss).toMatch(/:root\[data-motion="reduce"\]/);
    expect(indexCss).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)/);
    expect(indexCss).toMatch(/:root\[data-motion="reduce"\]/);
  });
});
