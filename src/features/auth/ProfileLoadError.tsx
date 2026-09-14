import { useState } from 'react';
import { useAuth } from './useAuth';
import { usePreferences } from '../preferences/PreferencesProvider';

/**
 * Shown when a session is authenticated but the profile row couldn't be read (Phase 6's
 * "profile-creation race" case — spec §164). The client is never allowed to insert a profile row
 * itself (profiles.INSERT is trigger-only by RLS design), so recovery here is retry-or-sign-out,
 * not a client-side insert attempt.
 */
export function ProfileLoadError() {
  const { refreshProfile, signOut } = useAuth();
  const { bi } = usePreferences();
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    setRetrying(true);
    await refreshProfile();
    setRetrying(false);
  }

  return (
    <div className="auth-loading-shell">
      <div>
        <p className="kicker">{bi({ en: 'Account', ar: 'الحساب' })}</p>
        <h1>{bi({ en: "We signed you in, but couldn't load your learner profile.", ar: 'سجّلنا دخولك، لكن تعذر تحميل ملف المتعلّم.' })}</h1>
        <p className="lede">{bi({ en: 'Your account is fine — this is usually temporary.', ar: 'حسابك سليم — هذا عادة مؤقت.' })}</p>
        <div className="cta-row">
          <button type="button" className="btn-primary" onClick={retry} disabled={retrying}>
            {retrying ? bi({ en: 'Retrying…', ar: 'جارٍ إعادة المحاولة…' }) : bi({ en: 'Retry', ar: 'إعادة المحاولة' })}
          </button>
          <button type="button" className="btn-secondary" onClick={() => signOut()}>
            {bi({ en: 'Sign out', ar: 'تسجيل الخروج' })}
          </button>
        </div>
      </div>
    </div>
  );
}
