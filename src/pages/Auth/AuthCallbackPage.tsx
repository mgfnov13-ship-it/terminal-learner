import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { sanitizeRedirect } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';

/**
 * Lands here from a Supabase email-verification link, password-recovery link, or (later) an
 * OAuth provider. The Supabase client parses the URL itself (detectSessionInUrl), so this page
 * just waits for auth state to settle and routes based on what kind of session resulted.
 */
export function AuthCallbackPage() {
  const { user, loading, isPasswordRecovery, isConfigured } = useAuth();
  const [params] = useSearchParams();
  const redirect = sanitizeRedirect(params.get('redirect'), '/app');
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  if (!isConfigured) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="kicker">Sign-in link</p>
          <h1>This link is invalid or has expired</h1>
          <p className="lede">Terminal Space isn't connected to an account backend yet.</p>
          <Link className="btn-secondary" to="/auth/sign-in">
            Back to sign in
          </Link>
        </div>
      </section>
    );
  }

  if (isPasswordRecovery) return <Navigate to="/auth/reset-password" replace />;
  if (user) return <Navigate to={redirect} replace />;

  if (loading && !timedOut) {
    return (
      <div className="auth-loading-shell" role="status" aria-live="polite">
        <span className="auth-loading-mark" aria-hidden>
          &gt;_
        </span>
        <p>Signing you in…</p>
      </div>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">Sign-in link</p>
        <h1>This link is invalid or has expired</h1>
        <p className="lede">Request a new link and try again.</p>
        <div className="cta-row">
          <Link className="btn-primary" to="/auth/sign-in">
            Back to sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
