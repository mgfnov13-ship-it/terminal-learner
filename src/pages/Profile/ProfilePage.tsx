import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { levelFromXp } from '../../data/player';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InlineNotice } from '../../components/UI/Feedback';
import { Field } from '../../components/UI/Primitives';

function initials(name: string | null | undefined, email: string | null | undefined): string {
  const source = (name ?? email ?? 'TS').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function ProfilePage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(t('profile'));
  const { user, profile, isConfigured, signOut, updateProfile } = useAuth();
  const { progress } = useOS();
  const navigate = useNavigate();
  const level = levelFromXp(progress.xp);
  const [name, setName] = useState(profile?.display_name ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  async function saveName(e: FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const { error: err } = await updateProfile({ display_name: name.trim() || null });
    if (err) {
      setError(bi(err));
      setStatus('error');
      return;
    }
    setStatus('done');
  }

  return (
    <>
      <section className="path-head">
        <p className="kicker">{t('profile')}</p>
        <h1>{t('profile')}</h1>
      </section>

      <section className="panel">
        <div className="profile-row">
          <span className="app-nav-avatar" aria-hidden>
            {initials(profile?.display_name ?? name, user?.email)}
          </span>
          <div>
            <strong>{profile?.display_name ?? (user ? user.email : bi({ en: 'Local development mode', ar: 'وضع التطوير المحلي' }))}</strong>
            <p className="panel-note">
              {user
                ? user.email
                : isConfigured
                  ? bi({ en: 'Not signed in.', ar: 'لست مسجّلاً للدخول.' })
                  : t('notConnected')}
            </p>
          </div>
        </div>
        {user && (
          <form className="auth-form" onSubmit={saveName}>
            <Field
              id="profile-name"
              label={t('displayName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="nickname"
            />
            {status === 'error' && error && <InlineNotice tone="error" title={error} />}
            {status === 'done' && <InlineNotice tone="success" title={t('nameSaved')} />}
            <button type="submit" className="btn-secondary" disabled={status === 'saving'}>
              {status === 'saving' ? t('updating') : t('save')}
            </button>
          </form>
        )}
        <dl className="stat-rows">
          <div>
            <dt>{t('level')}</dt>
            <dd>
              {t('level')} {level}
            </dd>
          </div>
          <div>
            <dt>XP</dt>
            <dd>{progress.xp.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</dd>
          </div>
        </dl>
      </section>

      <div className="cta-row">
        <Link className="btn-secondary" to="/app/settings">
          {t('settings')}
        </Link>
        {user && (
          <button type="button" className="btn-secondary" onClick={handleSignOut} title={t('sessionOnlyLogout')}>
            {t('signOut')}
          </button>
        )}
      </div>
    </>
  );
}
