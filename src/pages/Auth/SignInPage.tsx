import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { AuthFrame } from '../../components/Auth/AuthFrame';
import { GoogleMark } from '../../components/Auth/GoogleMark';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { InlineNotice } from '../../components/UI/Feedback';
import { Field as FormField } from '../../components/UI/Primitives';
import { crossAuthLink, persistPostAuthPath, sanitizeRedirect } from '../../features/auth/redirect';
import { hasPendingGoogleOAuth } from '../../features/auth/googleOAuth';
import { useAuth } from '../../features/auth/useAuth';
import { VALIDATION_COPY, validateEmail } from '../../features/auth/validation';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

export function SignInPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('signIn'));
  const { user, signIn, signInWithGoogle, isConfigured } = useAuth();
  const [params] = useSearchParams();
  const redirect = sanitizeRedirect(params.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(hasPendingGoogleOAuth);

  if (user) return <Navigate to={redirect} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const code = validateEmail(email);
    if (code) {
      setEmailError(bi(VALIDATION_COPY[code]));
      return;
    }
    if (!password) {
      setError(bi(VALIDATION_COPY.password_required));
      return;
    }
    setSubmitting(true);
    setError(null);
    setEmailError(null);
    persistPostAuthPath(redirect);
    const { error: authError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (authError) setError(bi(authError));
  }

  async function onGoogle() {
    setGoogleLoading(true);
    setError(null);
    persistPostAuthPath(redirect);
    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setGoogleLoading(false);
      setError(bi(authError));
    }
  }

  const busy = submitting || googleLoading;

  return (
    <AuthFrame
      kicker={t('signIn')}
      title={bi({ en: 'Welcome back', ar: 'مرحباً بعودتك' })}
      description={bi({
        en: 'Saved progress stays with your account. The simulated disk on this device stays here.',
        ar: 'التقدّم المحفوظ يبقى مع حسابك. القرص المحاكى على هذا الجهاز يبقى هنا.',
      })}
    >
      {!isConfigured && <p className="auth-note">{t('notConnected')}</p>}
      <div className="auth-form">
        <button type="button" className="btn-secondary google-btn" disabled={busy} onClick={onGoogle} aria-busy={googleLoading || undefined}>
          <GoogleMark />
          {googleLoading ? t('signingIn') : t('continueWithGoogle')}
        </button>
        <p className="auth-sep" role="separator">
          {t('orEmail')}
        </p>
      </div>
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <FormField
          id="signin-email"
          label={t('email')}
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          error={emailError ?? undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="ts-field" htmlFor="signin-password">
          <span className="ts-field__label">{t('password')}</span>
          <PasswordInput
            id="signin-password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            ariaInvalid={Boolean(error) && !emailError}
          />
          <span className="ts-field__helper">{'\u00a0'}</span>
        </label>
        {error && <InlineNotice tone="error" title={error} />}
        <button type="submit" className="btn-primary" disabled={busy}>
          {submitting ? t('signingIn') : t('signIn')}
        </button>
      </form>
      <p className="auth-links">
        <Link to={crossAuthLink('/auth/forgot-password')}>{t('forgotPassword')}</Link>
      </p>
      <p className="auth-links">
        {t('noAccount')} <Link to={crossAuthLink('/auth/sign-up')}>{t('createAccount')}</Link>
      </p>
    </AuthFrame>
  );
}
