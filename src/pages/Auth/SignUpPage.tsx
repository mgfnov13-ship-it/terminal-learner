import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { sanitizeRedirect } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';
import { validateConfirmPassword, validateEmail, validatePassword } from '../../features/auth/validation';

export function SignUpPage() {
  const { user, signUp, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = sanitizeRedirect(params.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={redirect} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirm);
    const firstError = emailError ?? passwordError ?? confirmError;
    if (firstError) return setError(firstError);
    setSubmitting(true);
    setError(null);
    const { error: authError } = await signUp(email.trim(), password);
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
    navigate(`/auth/verify?email=${encodeURIComponent(email.trim())}`);
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">Create account</p>
        <h1>Create your Terminal Space account</h1>
        {!isConfigured && (
          <p className="auth-note">
            Terminal Space isn't connected to an account backend yet — this form is ready, but nothing will submit
            until a Supabase project is configured.
          </p>
        )}
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="signup-password">Password</label>
          <PasswordInput id="signup-password" value={password} onChange={setPassword} autoComplete="new-password" />
          <p className="field-hint">At least 8 characters.</p>

          <label htmlFor="signup-confirm">Confirm password</label>
          <PasswordInput id="signup-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <p className="field-hint">
            By creating an account, you agree to the <Link to="/terms">Terms</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-links">
          Already have an account? <Link to="/auth/sign-in">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
