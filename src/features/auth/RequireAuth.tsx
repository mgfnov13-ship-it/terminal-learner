import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePreferences } from '../preferences/PreferencesProvider';
import { useAuth } from './useAuth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const { t, bi } = usePreferences();
  const location = useLocation();

  if (!isConfigured) {
    if (import.meta.env.DEV) return <>{children}</>;
    return (
      <div className="auth-loading-shell">
        <div>
          <p className="kicker">{bi({ en: 'Learning accounts are temporarily unavailable', ar: 'حسابات التعلّم غير متاحة مؤقتاً' })}</p>
          <h1>{bi({ en: 'The public demo is still available.', ar: 'العرض التجريبي العام ما زال متاحاً.' })}</h1>
          <p className="lede">
            {bi({
              en: 'Try the sandboxed demo, or come back shortly — the rest of the site works normally.',
              ar: 'جرّب العرض التجريبي المعزول، أو عد بعد قليل — بقية الموقع تعمل كالمعتاد.',
            })}
          </p>
          <div className="cta-row">
            <a className="btn-primary" href="/demo">
              {bi({ en: 'Try the demo', ar: 'جرّب العرض' })}
            </a>
            <a className="btn-secondary" href="/">
              {t('home')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="auth-loading-shell" role="status" aria-live="polite">
        <span className="auth-loading-mark" aria-hidden>
          &gt;_
        </span>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/auth/sign-in?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}
