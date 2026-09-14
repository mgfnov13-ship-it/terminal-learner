import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const ALWAYS_ALLOWED = ['/app/onboarding', '/app/profile', '/app/settings'];

/**
 * Redirects a signed-in account whose onboarding isn't complete to /app/onboarding, from any
 * /app/* page except onboarding itself, profile, and settings (so a learner can always fix
 * account details or sign out mid-onboarding). No-op in local/dev mode or while unconfigured —
 * there is no account lifecycle to gate against (Non-negotiable #6 in the implementation plan:
 * this gate is designed in Phase 1 but only mounted here in Phase 6, once /app/onboarding exists).
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const { isConfigured, profile } = useAuth();
  const location = useLocation();

  if (!isConfigured || !profile) return <>{children}</>;
  if (profile.onboarding_complete) return <>{children}</>;
  if (ALWAYS_ALLOWED.some((p) => location.pathname.startsWith(p))) return <>{children}</>;

  return <Navigate to="/app/onboarding" replace />;
}
