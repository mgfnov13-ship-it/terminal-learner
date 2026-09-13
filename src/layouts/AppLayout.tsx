import { Outlet } from 'react-router-dom';
import { useAppChrome } from '../hooks/useAppChrome';
import { ConfirmDialog, ToastStack } from '../components/UI/Chrome';
import { AppNav } from '../components/Nav/AppNav';

/** Authenticated learner workspace shell: dashboard, learn, missions, progress, achievements. */
export function AppLayout() {
  useAppChrome();
  return (
    <div className="site-shell app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AppNav />
      <main className="site-main" id="main">
        <Outlet />
      </main>
      <ToastStack />
      <ConfirmDialog />
    </div>
  );
}
