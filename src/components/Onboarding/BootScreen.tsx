import { useEffect, useState } from 'react';
import { useOSApi } from '../../hooks/useOS';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function BootScreen() {
  const api = useOSApi();
  const { t } = usePreferences();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const next = Math.min(100, Math.round(((Date.now() - start) / 1600) * 100));
      setPct(next);
      if (next >= 100) {
        window.clearInterval(id);
        api.finishBoot();
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [api]);

  return (
    <main className="boot">
      <p className="welcome-mark">TS</p>
      <h1>{t('appName')}</h1>
      <p>{t('startingComputer')}</p>
      <div
        className="boot-bar"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('startingComputer')}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      <button type="button" className="text-btn" onClick={() => api.skipBoot()}>
        {t('skip')}
      </button>
    </main>
  );
}
