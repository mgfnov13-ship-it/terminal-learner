import { NavLink, useNavigate } from 'react-router-dom';
import { AccessibilityPanel, LanguageToggle } from '../A11y/AccessibilityPanel';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function SiteNav() {
  const navigate = useNavigate();
  const { user, isConfigured } = useAuth();
  const { t } = usePreferences();

  const links = [
    { to: '/tracks', label: t('tracks') },
    { to: '/how-it-works', label: t('howItWorks') },
    { to: '/about', label: t('about') },
  ];

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <NavLink to="/" className="site-mark" end>
          <span className="site-mark-prompt" aria-hidden>
            ~/
          </span>
          terminal-space
        </NavLink>
        <nav className="site-nav-links" aria-label={t('mainNav')}>
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="site-nav-caret" aria-hidden />
        <div className="site-nav-cta">
          <div className="chrome-utilities" role="group" aria-label={t('langAndA11y')}>
            <LanguageToggle />
            <AccessibilityPanel iconOnly />
          </div>
          {user ? (
            <button type="button" className="btn-chip" onClick={() => navigate('/app')}>
              {t('dashboard')}
            </button>
          ) : (
            <>
              <NavLink to="/auth/sign-in" className="site-nav-signin">
                {t('signIn')}
              </NavLink>
              <button
                type="button"
                className="btn-chip"
                onClick={() => navigate(isConfigured ? '/auth/sign-up' : '/app')}
              >
                {t('startLearning')}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
