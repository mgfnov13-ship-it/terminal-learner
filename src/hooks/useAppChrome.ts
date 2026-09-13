import { useEffect } from 'react';
import { useOS, useOSApi } from './useOS';

/** Keeps theme and motion preference on <html> for every surface, site or lab. */
export function useAppChrome(): void {
  const { settings } = useOS();
  const api = useOSApi();
  const theme = api.resolvedTheme();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.motion = settings.reducedMotion ? 'reduced' : 'full';
  }, [settings.reducedMotion]);
}
