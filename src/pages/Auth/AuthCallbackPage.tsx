import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { AuthFrame } from '../../components/Auth/AuthFrame';
import { LoadingSkeleton } from '../../components/UI/Feedback';
import { consumePostAuthPath, sanitizeRedirect } from '../../features/auth/redirect';
import { clearGoogleOAuthPending } from '../../features/auth/googleOAuth';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

export function AuthCallbackPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('signingYouIn'));
  const { user, loading, isPasswordRecovery, isConfigured } = useAuth();
  const [params] = useSearchParams();
  const stored = useRef<string | null>(null);
  if (stored.current === null) stored.current = consumePostAuthPath('/app');
  const redirect = sanitizeRedirect(params.get('redirect') ?? stored.current, '/app');
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 6000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) clearGoogleOAuthPending();
  }, [user]);

  if (!isConfigured) {
    return (
      <AuthFrame
        kicker={bi({ en: 'Sign-in link', ar: 'رابط تسجيل الدخول' })}
        title={bi({ en: 'This link is invalid or has expired', ar: 'هذا الرابط غير صالح أو منتهٍ' })}
        description={t('notConnected')}
      >
        <Link className="btn-secondary" to="/auth/sign-in">
          {bi({ en: 'Back to sign in', ar: 'العودة لتسجيل الدخول' })}
        </Link>
      </AuthFrame>
    );
  }

  if (isPasswordRecovery) return <Navigate to="/auth/reset-password" replace />;
  if (user) return <Navigate to={redirect} replace />;

  if (loading && !timedOut) return <LoadingSkeleton label={t('signingYouIn')} />;

  return (
    <AuthFrame
      kicker={bi({ en: 'Sign-in link', ar: 'رابط تسجيل الدخول' })}
      title={bi({ en: 'This link is invalid or has expired', ar: 'هذا الرابط غير صالح أو منتهٍ' })}
      description={bi({ en: 'Request a new link and try again.', ar: 'اطلب رابطاً جديداً ثم أعد المحاولة.' })}
    >
      <Link className="btn-primary" to="/auth/sign-in">
        {bi({ en: 'Back to sign in', ar: 'العودة لتسجيل الدخول' })}
      </Link>
    </AuthFrame>
  );
}
