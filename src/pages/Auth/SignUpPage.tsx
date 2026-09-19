import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthFrame } from '../../components/Auth/AuthFrame';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { InlineNotice } from '../../components/UI/Feedback';
import { Field as FormField } from '../../components/UI/Primitives';
import { crossAuthLink, persistPostAuthPath, sanitizeRedirect } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';
import { VALIDATION_COPY, validateConfirmPassword, validateEmail, validatePassword } from '../../features/auth/validation';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

export function SignUpPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('signUp'));
  const { user, signUp, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = sanitizeRedirect(params.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldError, setFieldError] = useState<{ email?: string; password?: string; confirm?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={redirect} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const emailCode = validateEmail(email);
    const passwordCode = validatePassword(password);
    const confirmCode = validateConfirmPassword(password, confirm);
    if (emailCode || passwordCode || confirmCode) {
      setFieldError({
        email: emailCode ? bi(VALIDATION_COPY[emailCode]) : undefined,
        password: passwordCode ? bi(VALIDATION_COPY[passwordCode]) : undefined,
        confirm: confirmCode ? bi(VALIDATION_COPY[confirmCode]) : undefined,
      });
      return;
    }
    setSubmitting(true);
    setError(null);
    setFieldError({});
    persistPostAuthPath(redirect);
    const { error: authError, session } = await signUp(email.trim(), password);
    setSubmitting(false);
    if (authError) {
      setError(bi(authError));
      return;
    }
    if (session) {
      navigate(redirect, { replace: true });
      return;
    }
    const next = encodeURIComponent(redirect);
    navigate(`/auth/verify?email=${encodeURIComponent(email.trim())}&redirect=${next}`);
  }

  const busy = submitting;
  const confirmLive = confirm.length > 0 && confirm !== password ? bi(VALIDATION_COPY.confirm_mismatch) : undefined;

  return (
    <AuthFrame
      kicker={t('createAccount')}
      title={bi({ en: 'Create your Terminal Space account', ar: 'أنشئ حساب تيرمنال سبيس' })}
      description={bi({
        en: 'We will send a verification link. Your simulated disk stays on this device.',
        ar: 'سنرسل رابط تأكيد. القرص المحاكى يبقى على هذا الجهاز.',
      })}
    >
      {!isConfigured && <p className="auth-note">{t('notConnected')}</p>}
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <FormField
          id="signup-email"
          label={t('email')}
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          error={fieldError.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="ts-field" htmlFor="signup-password">
          <span className="ts-field__label">{t('password')}</span>
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            ariaInvalid={Boolean(fieldError.password)}
            ariaDescribedBy="signup-password-helper"
          />
          <span id="signup-password-helper" className="ts-field__helper" data-tone={fieldError.password ? 'error' : 'neutral'}>
            {fieldError.password || t('passwordHint')}
          </span>
        </label>
        <label className="ts-field" htmlFor="signup-confirm">
          <span className="ts-field__label">{t('confirmPassword')}</span>
          <PasswordInput
            id="signup-confirm"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            ariaInvalid={Boolean(confirmLive || fieldError.confirm)}
          />
          <span className="ts-field__helper" data-tone={confirmLive || fieldError.confirm ? 'error' : 'neutral'}>
            {confirmLive || fieldError.confirm || '\u00a0'}
          </span>
        </label>
        {error && <InlineNotice tone="error" title={error} />}
        <p className="field-hint">
          {bi({
            en: 'By creating an account, you agree to the',
            ar: 'بإنشاء حساب فإنك توافق على',
          })}{' '}
          <Link to="/terms">{bi({ en: 'Terms', ar: 'الشروط' })}</Link>{' '}
          {bi({ en: 'and', ar: 'و' })}{' '}
          <Link to="/privacy">{bi({ en: 'Privacy Policy', ar: 'سياسة الخصوصية' })}</Link>.
        </p>
        <button type="submit" className="btn-primary" disabled={busy}>
          {submitting ? t('creatingAccount') : t('createAccount')}
        </button>
      </form>
      <p className="auth-links">
        {t('haveAccount')} <Link to={crossAuthLink('/auth/sign-in')}>{t('signIn')}</Link>
      </p>
    </AuthFrame>
  );
}
