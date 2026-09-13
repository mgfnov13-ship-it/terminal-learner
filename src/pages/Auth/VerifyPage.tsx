import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export function VerifyPage() {
  const { resendVerification, isConfigured } = useAuth();
  const [params] = useSearchParams();
  const email = params.get('email') ?? '';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    if (!email) return;
    setStatus('sending');
    const { error: authError } = await resendVerification(email);
    if (authError) {
      setError(authError);
      setStatus('error');
      return;
    }
    setStatus('sent');
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">Check your inbox</p>
        <h1>Verify your email</h1>
        <p className="lede">
          {email
            ? (
              <>
                We sent a verification link to <strong>{email}</strong>. Open it to finish creating your account.
              </>
            )
            : 'We sent a verification link to your email. Open it to finish creating your account.'}
        </p>
        {!isConfigured && (
          <p className="auth-note">
            Terminal Space isn't connected to an account backend yet, so no email was actually sent.
          </p>
        )}
        {status === 'sent' && <p className="field-ok">Verification email resent.</p>}
        {status === 'error' && error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <div className="cta-row">
          <button type="button" className="btn-secondary" onClick={resend} disabled={!email || status === 'sending'}>
            {status === 'sending' ? 'Resending…' : 'Resend email'}
          </button>
          <Link className="text-link" to="/auth/sign-up">
            Use a different email
          </Link>
        </div>
      </div>
    </section>
  );
}
