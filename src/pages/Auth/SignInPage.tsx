import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { sanitizeRedirect } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';
import { validateEmail } from '../../features/auth/validation';

export function SignInPage() {
  const { user, signIn, isConfigured } = useAuth();
  const [params] = useSearchParams();
  const redirect = sanitizeRedirect(params.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={redirect} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);
    if (!password) return setError('Enter your password.');
    setSubmitting(true);
    setError(null);
    const { error: authError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (authError) setError(authError);
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">Sign in</p>
        <h1>Welcome back</h1>
        {!isConfigured && (
          <p className="auth-note">
            Terminal Space isn't connected to an account backend yet — this form is ready, but nothing will submit
            until a Supabase project is configured.
          </p>
        )}
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="signin-password">Password</label>
          <PasswordInput id="signin-password" value={password} onChange={setPassword} autoComplete="current-password" />

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="auth-links">
          <Link to="/auth/forgot-password">Forgot password?</Link>
        </p>
        <p className="auth-links">
          Don't have an account? <Link to="/auth/sign-up">Create one</Link>
        </p>
      </div>
    </section>
  );
}
