import { useOSApi } from '../../hooks/useOS';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function WelcomeScreen() {
  const api = useOSApi();
  const { t } = usePreferences();
  return (
    <main className="welcome">
      <p className="welcome-mark">TS</p>
      <h1>{t('appName')}</h1>
      <p>{t('welcomeLearn')}</p>
      <p>{t('welcomeSafe')}</p>
      <button type="button" className="btn-primary" onClick={() => api.finishWelcome()}>
        {t('continue')}
      </button>
    </main>
  );
}
