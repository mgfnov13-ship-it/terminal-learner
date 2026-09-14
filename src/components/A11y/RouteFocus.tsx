import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/** After client-side navigation, move focus to main so keyboard and SR users get a new page. */
export function RouteFocus() {
  const { pathname, search } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      document.querySelector<HTMLElement>('main[tabindex="-1"], [role="main"][tabindex="-1"]')?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, search]);

  return null;
}
