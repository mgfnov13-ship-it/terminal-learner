import { useEffect } from 'react';
import { usePreferences } from '../features/preferences/PreferencesProvider';

/** Sets the browser tab title for the page that calls it. Brand name alone for the home page. */
export function usePageTitle(title?: string) {
  const { t } = usePreferences();
  const brand = t('appName');
  useEffect(() => {
    document.title = title ? `${title} | ${brand}` : brand;
  }, [brand, title]);
}
