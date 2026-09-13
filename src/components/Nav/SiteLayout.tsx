import { Outlet } from 'react-router-dom';
import { useAppChrome } from '../../hooks/useAppChrome';
import { ConfirmDialog, ToastStack } from '../UI/Chrome';
import { SiteFooter } from './SiteFooter';
import { SiteNav } from './SiteNav';

export function SiteLayout() {
  useAppChrome();
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main className="site-main" id="main">
        <Outlet />
      </main>
      <SiteFooter />
      {/* Reset confirmations and XP toasts have to exist outside the lab too. */}
      <ToastStack />
      <ConfirmDialog />
    </div>
  );
}
