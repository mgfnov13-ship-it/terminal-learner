/**
 * Lab side-by-side needs both width and height. Phones, plus landscape phones
 * that are wide but short, switch to a one-pane Terminal/Guide layout.
 */
export const LAB_COMPACT_QUERY = '(max-width: 719px), (max-height: 539px)';

/** Phones in portrait, and anything narrower than an iPad Mini. */
export const PHONE_QUERY = '(max-width: 47.99rem)';

export function isLabCompact(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(LAB_COMPACT_QUERY).matches;
}
