import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFrame } from '../../components/Auth/AuthFrame';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { InlineNotice, LoadingSkeleton } from '../../components/UI/Feedback';
import { useAuth } from '../../features/auth/useAuth';
import { VALIDATION_COPY, validateConfirmPassword, validatePassword } from '../../features/auth/validation';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

type ResetPhase = 'checking' | 'invalid' | 'form' | 'success';

export function ResetPasswordPage() {
  const { t, bi } = usePreferences();
  usePageTitle(bi({ en: 'Reset password', ar: 'إعادة تعيين كلمة المرور' }));
  const { isPasswordRecovery, updatePassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{ password?: string; confirm?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    if (isPasswordRecovery) {
      setWaited(true);
      return;
    }
    if (loading) return;
    const timer = window.setTimeout(() => setWaited(true), 900);
    return () => window.clearTimeout(timer);
  }, [isPasswordRecovery, loading]);

  const phase: ResetPhase = done
    ? 'success'
    : !waited || loading
      ? 'checking'
      : isPasswordRecovery
        ? 'form'
        : 'invalid';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const passwordCode = validatePassword(password);
    const confirmCode = validateConfirmPassword(password, confirm);
    if (passwordCode || confirmCode) {
      setFieldError({
        password: passwordCode ? bi(VALIDATION_COPY[passwordCode]) : undefined,
        confirm: confirmCode ? bi(VALIDATION_COPY[confirmCode]) : undefined,
      });
      return;
    }
    setSubmitting(true);
    setError(null);
    setFieldError({});
    const { error: authError } = await updatePassword(password);
    setSubmitting(false);
    if (authError) {
      setError(bi(authError));
      return;
    }
    setDone(true);
  }

  if (phase === 'checking') {
    return (
      <AuthFrame
        kicker={bi({ en: 'Reset link', ar: 'رابط إعادة التعيين' })}
        title={bi({ en: 'Checking this reset link', ar: 'جارٍ التحقق من رابط إعادة التعيين' })}
        description={bi({
          en: 'Hang on while we confirm the link from your email.',
          ar: 'انتظر ريثما نؤكّد الرابط القادم من بريدك.',
        })}
      >
        <LoadingSkeleton label={t('loading')} />
      </AuthFrame>
    );
  }

  if (phase === 'invalid') {
    return (
      <AuthFrame
        kicker={bi({ en: 'Reset link', ar: 'رابط إعادة التعيين' })}
        title={bi({ en: 'This link is invalid or has expired', ar: 'هذا الرابط غير صالح أو منتهٍ' })}
        description={bi({
          en: 'Request a new password reset link and try again.',
          ar: 'اطلب رابطاً جديداً ثم أعد المحاولة.',
        })}
      >
        <div className="cta-row">
          <Link className="btn-primary" to="/auth/forgot-password">
            {bi({ en: 'Request a new link', ar: 'طلب رابط جديد' })}
          </Link>
          <Link className="btn-secondary" to="/auth/sign-in">
            {bi({ en: 'Back to sign in', ar: 'العودة لتسجيل الدخول' })}
          </Link>
        </div>
      </AuthFrame>
    );
  }

  if (phase === 'success') {
    return (
      <AuthFrame
        kicker={bi({ en: 'Password updated', ar: 'تم تحديث كلمة المرور' })}
        title={bi({ en: 'Password updated successfully', ar: 'تم تحديث كلمة المرور بنجاح' })}
        description={bi({
          en: 'You can continue into Terminal Space with the new password.',
          ar: 'يمكنك المتابعة إلى تيرمنال سبيس بكلمة المرور الجديدة.',
        })}
      >
        <div className="cta-row">
          <button type="button" className="btn-primary" onClick={() => navigate('/app')}>
            {bi({ en: 'Continue to Terminal Space', ar: 'المتابعة إلى تيرمنال سبيس' })}
          </button>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      kicker={bi({ en: 'Reset password', ar: 'إعادة تعيين كلمة المرور' })}
      title={bi({ en: 'Choose a new password', ar: 'اختر كلمة مرور جديدة' })}
      description={bi({
        en: 'Use a long phrase you do not use for another account.',
        ar: 'استخدم عبارة طويلة لا تستعملها في حساب آخر.',
      })}
    >
      {user?.email ? (
        <InlineNotice tone="info" title={bi({ en: 'Account confirmed', ar: 'تم تأكيد الحساب' })}>
          <span dir="ltr">{user.email}</span>
        </InlineNotice>
      ) : null}
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label className="ts-field" htmlFor="reset-password">
          <span className="ts-field__label">{t('newPassword')}</span>
          <PasswordInput
            id="reset-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            ariaInvalid={Boolean(fieldError.password)}
          />
          <span className="ts-field__helper" data-tone={fieldError.password ? 'error' : 'neutral'}>
            {fieldError.password || t('passwordHint')}
          </span>
        </label>
        <label className="ts-field" htmlFor="reset-confirm">
          <span className="ts-field__label">{t('confirmPassword')}</span>
          <PasswordInput
            id="reset-confirm"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            ariaInvalid={Boolean(fieldError.confirm)}
          />
          <span className="ts-field__helper" data-tone={fieldError.confirm ? 'error' : 'neutral'}>
            {fieldError.confirm || '\u00a0'}
          </span>
        </label>
        {error && <InlineNotice tone="error" title={error} />}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? t('updating') : bi({ en: 'Update password', ar: 'تحديث كلمة المرور' })}
        </button>
      </form>
    </AuthFrame>
  );
}
