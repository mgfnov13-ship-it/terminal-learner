import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthFrame } from '../../components/Auth/AuthFrame';
import { InlineNotice } from '../../components/UI/Feedback';
import { Field as FormField } from '../../components/UI/Primitives';
import { crossAuthLink } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';
import { VALIDATION_COPY, validateEmail } from '../../features/auth/validation';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

export function ForgotPasswordPage() {
  const { t, bi } = usePreferences();
  usePageTitle(bi({ en: 'Forgot password', ar: 'نسيت كلمة المرور' }));
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const code = validateEmail(email);
    if (code) {
      setFieldError(bi(VALIDATION_COPY[code]));
      return;
    }
    setSubmitting(true);
    setError(null);
    setFieldError(undefined);
    const { error: authError } = await resetPassword(email.trim());
    setSubmitting(false);
    if (authError) {
      setError(bi(authError));
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthFrame
        kicker={bi({ en: 'Check your inbox', ar: 'تحقق من صندوق الوارد' })}
        title={bi({ en: 'Reset link sent', ar: 'أُرسل رابط إعادة التعيين' })}
        description={bi({
          en: `If an account exists for ${email.trim()}, we sent a password reset link to it. Check spam if you do not see it.`,
          ar: `إذا كان هناك حساب لـ ${email.trim()} فقد أرسلنا رابط إعادة تعيين كلمة المرور إليه. تحقق من البريد غير المرغوب إن لم تجده.`,
        })}
      >
        <p className="auth-links">
          <Link to={crossAuthLink('/auth/sign-in')}>{bi({ en: 'Back to sign in', ar: 'العودة لتسجيل الدخول' })}</Link>
        </p>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      kicker={bi({ en: 'Forgot password', ar: 'نسيت كلمة المرور' })}
      title={bi({ en: 'Reset your password', ar: 'أعد تعيين كلمة المرور' })}
      description={bi({
        en: "Enter the email on your account and we'll send you a reset link.",
        ar: 'أدخل البريد الإلكتروني لحسابك وسنرسل رابط إعادة التعيين.',
      })}
    >
      {!isConfigured && <p className="auth-note">{t('notConnected')}</p>}
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <FormField
          id="forgot-email"
          label={t('email')}
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          error={fieldError}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <InlineNotice tone="error" title={error} />}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? t('sending') : bi({ en: 'Send reset link', ar: 'إرسال رابط إعادة التعيين' })}
        </button>
      </form>
      <p className="auth-links">
        <Link to={crossAuthLink('/auth/sign-in')}>{bi({ en: 'Back to sign in', ar: 'العودة لتسجيل الدخول' })}</Link>
      </p>
    </AuthFrame>
  );
}
