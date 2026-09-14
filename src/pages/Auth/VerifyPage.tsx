import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthFrame } from '../../components/Auth/AuthFrame';
import { InlineNotice } from '../../components/UI/Feedback';
import { sanitizeRedirect } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

export function VerifyPage() {
  const { t, bi } = usePreferences();
  usePageTitle(bi({ en: 'Verify email', ar: 'تأكيد البريد' }));
  const { resendVerification, isConfigured } = useAuth();
  const [params] = useSearchParams();
  const email = params.get('email') ?? '';
  const redirect = sanitizeRedirect(params.get('redirect'));
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    if (!email) return;
    setStatus('sending');
    const { error: authError } = await resendVerification(email);
    if (authError) {
      setError(bi(authError));
      setStatus('error');
      return;
    }
    setStatus('sent');
  }

  return (
    <AuthFrame
      kicker={bi({ en: 'Check your inbox', ar: 'تحقق من صندوق الوارد' })}
      title={bi({ en: 'Verify your email', ar: 'أكّد بريدك الإلكتروني' })}
      description={
        email
          ? bi({
              en: `We sent a verification link to ${email}. Open it to finish creating your account. Check spam if you do not see it.`,
              ar: `أرسلنا رابط تأكيد إلى ${email}. افتحه لإكمال إنشاء الحساب. تحقق من البريد غير المرغوب إن لم تجده.`,
            })
          : bi({
              en: 'We sent a verification link to your email. Open it to finish creating your account.',
              ar: 'أرسلنا رابط تأكيد إلى بريدك. افتحه لإكمال إنشاء الحساب.',
            })
      }
    >
      {!isConfigured && <p className="auth-note">{t('notConnected')}</p>}
      {status === 'sent' && (
        <InlineNotice tone="success" title={bi({ en: 'Verification email resent.', ar: 'أُعيد إرسال رسالة التأكيد.' })} />
      )}
      {status === 'error' && error && <InlineNotice tone="error" title={error} />}
      <div className="cta-row">
        <button type="button" className="btn-secondary" onClick={resend} disabled={!email || status === 'sending'}>
          {status === 'sending' ? t('sending') : bi({ en: 'Resend email', ar: 'إعادة إرسال الرسالة' })}
        </button>
        <Link className="text-link" to={`/auth/sign-up?redirect=${encodeURIComponent(redirect)}`}>
          {bi({ en: 'Use a different email', ar: 'استخدم بريداً آخر' })}
        </Link>
      </div>
    </AuthFrame>
  );
}
