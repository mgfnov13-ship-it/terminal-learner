import { Outlet } from 'react-router-dom';
import { ConfirmDialog, ToastStack } from '../components/UI/Chrome';
import { AppNav } from '../components/Nav/AppNav';
import { OnboardingGate } from '../features/auth/OnboardingGate';
import { ProfileLoadError } from '../features/auth/ProfileLoadError';
import { useAuth } from '../features/auth/useAuth';
import { usePreferences } from '../features/preferences/PreferencesProvider';

export function AppLayout() {
  const { t } = usePreferences();
  const { isConfigured, user, profile, profileLoading } = useAuth();

  if (isConfigured && user && !profile && !profileLoading) {
    return <ProfileLoadError />;
  }

  return (
    <div className="site-shell app-shell">
      <a className="skip-link" href="#main">
        {t('skip')}
      </a>
      <AppNav />
      <main className="site-main" id="main" tabIndex={-1}>
        <OnboardingGate>
          <Outlet />
        </OnboardingGate>
      </main>
      <ToastStack />
      <ConfirmDialog />
    </div>
  );
}
