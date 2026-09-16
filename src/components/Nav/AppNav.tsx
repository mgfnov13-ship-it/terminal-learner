import { NavLink } from 'react-router-dom';
import { AccessibilityPanel } from '../A11y/AccessibilityPanel';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useSyncStatus } from '../../features/sync/syncStatusStore';
import { PHONE_QUERY, useMedia } from '../../hooks/useMedia';

function initials(name: string | null | undefined, email: string | null | undefined): string {
  const source = (name ?? email ?? 'TS').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function AppNav() {
  const { t } = usePreferences();
  const { isConfigured, user, profile } = useAuth();
  const syncStatus = useSyncStatus();
  const phone = useMedia(PHONE_QUERY);
  const showLocalModeLabel = import.meta.env.DEV && !isConfigured;
  const showSyncStatus = isConfigured && Boolean(user) && syncStatus !== 'idle';
  const links = [
    { to: '/app', label: t('dashboard'), end: true },
    { to: '/app/learn', label: t('learn') },
    { to: '/app/missions', label: t('missions') },
    { to: '/app/progress', label: t('progress') },
    { to: '/app/achievements', label: t('achievements') },
    ...(phone
      ? [
          { to: '/app/help', label: t('help'), end: false },
          { to: '/app/settings', label: t('settings'), end: false },
        ]
      : []),
  ];

  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <NavLink to="/app" className="app-mark" aria-label={t('dashboard')}>
          <span className="app-mark-ico" aria-hidden>
            &gt;_
          </span>
          {t('appName')}
        </NavLink>
        <nav className="app-nav-links" aria-label={t('appName')}>
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="app-nav-side">
          {showLocalModeLabel && <span className="app-nav-badge">{t('localMode')}</span>}
          {showSyncStatus && (
            <span
              className={`app-nav-sync${syncStatus === 'retrying' ? ' is-warn' : ''}`}
              role="status"
              aria-live="polite"
            >
              {syncStatus === 'hydrating' ? t('syncSaving') : syncStatus === 'retrying' ? t('syncRetry') : t('syncSaved')}
            </span>
          )}
          <AccessibilityPanel iconOnly />
          {!phone ? (
            <>
              <NavLink to="/app/help" className="app-nav-icon">
                {t('help')}
              </NavLink>
              <NavLink to="/app/settings" className="app-nav-icon">
                {t('settings')}
              </NavLink>
            </>
          ) : null}
          <NavLink
            to="/app/profile"
            className="app-nav-avatar"
            aria-label={t('profile')}
          >
            {initials(profile?.display_name, user?.email)}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
