import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { useAuth } from '../../features/auth/useAuth';
import { validateConfirmPassword, validatePassword } from '../../features/auth/validation';

export function ResetPasswordPage() {
  const { isPasswordRecovery, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!isPasswordRecovery) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="kicker">Reset link</p>
          <h1>This link is invalid or has expired</h1>
          <p className="lede">Request a new password reset link and try again.</p>
          <div className="cta-row">
            <Link className="btn-primary" to="/auth/forgot-password">
              Request a new link
            </Link>
            <Link className="btn-secondary" to="/auth/sign-in">
              Back to sign in
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="kicker">Password updated</p>
          <h1>Password updated successfully</h1>
          <div className="cta-row">
            <button type="button" className="btn-primary" onClick={() => navigate('/app')}>
              Continue to Terminal Space
            </button>
          </div>
        </div>
      </section>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirm);
    const firstError = passwordError ?? confirmError;
    if (firstError) return setError(firstError);
    setSubmitting(true);
    setError(null);
    const { error: authError } = await updatePassword(password);
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
    setDone(true);
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">Reset password</p>
        <h1>Choose a new password</h1>
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="reset-password">New password</label>
          <PasswordInput id="reset-password" value={password} onChange={setPassword} autoComplete="new-password" />
          <p className="field-hint">At least 8 characters.</p>

          <label htmlFor="reset-confirm">Confirm new password</label>
          <PasswordInput id="reset-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </section>
  );
}
