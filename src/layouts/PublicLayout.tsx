import { Outlet } from 'react-router-dom';
import { AccessibilityPanel, LanguageToggle } from '../components/A11y/AccessibilityPanel';
import { ConfirmDialog, ToastStack } from '../components/UI/Chrome';
import { SiteFooter } from '../components/Nav/SiteFooter';
import { SiteNav } from '../components/Nav/SiteNav';
import { usePreferences } from '../features/preferences/PreferencesProvider';

export function PublicLayout() {
  const { t } = usePreferences();
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        {t('skip')}
      </a>
      <SiteNav />
      <main className="site-main" id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <ToastStack />
      <ConfirmDialog />
    </div>
  );
}

export function PublicUtilities() {
  return (
    <div className="chrome-utilities" role="group">
      <LanguageToggle />
      <AccessibilityPanel iconOnly />
    </div>
  );
}
