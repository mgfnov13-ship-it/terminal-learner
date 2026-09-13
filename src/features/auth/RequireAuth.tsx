import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Guards every /app/* and /app/lab/* route.
 *
 * Configured: real gate — unauthenticated visitors are sent to sign in and returned afterward.
 * Unconfigured + dev: passes through as local/guest mode (labeled elsewhere in the app shell) so
 * development keeps working without a Supabase project.
 * Unconfigured + production build: never silently grants guest access to what looks like an
 * authenticated app — shows a configuration-unavailable state instead.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (!isConfigured) {
    if (import.meta.env.DEV) return <>{children}</>;
    return <ConfigurationUnavailable />;
  }

  if (loading) return <AuthLoadingShell />;

  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/auth/sign-in?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}

function AuthLoadingShell() {
  return (
    <div className="auth-loading-shell" role="status" aria-live="polite">
      <span className="auth-loading-mark" aria-hidden>
        &gt;_
      </span>
      <p>Loading Terminal Space…</p>
    </div>
  );
}

function ConfigurationUnavailable() {
  return (
    <div className="auth-loading-shell">
      <div>
        <p className="kicker">Learning accounts are temporarily unavailable</p>
        <h1>The public demo is still available.</h1>
        <p className="lede">
          Try the sandboxed demo, or come back shortly — the rest of the site works normally.
        </p>
        <div className="cta-row">
          <a className="btn-primary" href="/demo">
            Try the demo
          </a>
          <a className="btn-secondary" href="/">
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
