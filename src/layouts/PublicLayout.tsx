import { Outlet } from 'react-router-dom';
import { useAppChrome } from '../hooks/useAppChrome';
import { ConfirmDialog, ToastStack } from '../components/UI/Chrome';
import { SiteFooter } from '../components/Nav/SiteFooter';
import { SiteNav } from '../components/Nav/SiteNav';

/** Public marketing/product website shell: homepage, tracks, about, auth, legal. */
export function PublicLayout() {
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
