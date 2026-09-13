import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { validateEmail } from '../../features/auth/validation';

export function ForgotPasswordPage() {
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);
    setSubmitting(true);
    setError(null);
    const { error: authError } = await resetPassword(email.trim());
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="kicker">Check your inbox</p>
          <h1>Reset link sent</h1>
          <p className="lede">
            If an account exists for <strong>{email.trim()}</strong>, we sent a password reset link to it.
          </p>
          <p className="auth-links">
            <Link to="/auth/sign-in">Back to sign in</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">Forgot password</p>
        <h1>Reset your password</h1>
        <p className="lede">Enter the email on your account and we'll send you a reset link.</p>
        {!isConfigured && (
          <p className="auth-note">
            Terminal Space isn't connected to an account backend yet — this form is ready, but nothing will submit
            until a Supabase project is configured.
          </p>
        )}
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <p className="auth-links">
          <Link to="/auth/sign-in">Back to sign in</Link>
        </p>
      </div>
    </section>
  );
}
