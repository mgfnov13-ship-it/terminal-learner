import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AccessibilityPanel, LanguageToggle } from '../A11y/AccessibilityPanel';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { PHONE_QUERY, useMedia } from '../../hooks/useMedia';

export function SiteNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isConfigured } = useAuth();
  const { t } = usePreferences();
  const phone = useMedia(PHONE_QUERY);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/tracks', label: t('tracks') },
    { to: '/how-it-works', label: t('howItWorks') },
    { to: '/about', label: t('about') },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!phone) setMenuOpen(false);
  }, [phone]);

  return (
    <header className="site-nav">
      <div className={`site-nav-inner${menuOpen ? ' is-open' : ''}`}>
        <NavLink to="/" className="site-mark" end>
          <span className="site-mark-prompt" aria-hidden>
            ~/
          </span>
          terminal-space
        </NavLink>
        <nav
          className="site-nav-links"
          id="site-menu"
          aria-label={t('mainNav')}
          hidden={phone && !menuOpen}
        >
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>
              {label}
            </NavLink>
          ))}
          {phone && user ? (
            <NavLink to="/app">{t('dashboard')}</NavLink>
          ) : null}
          {phone && !user ? (
            <>
              <NavLink to="/auth/sign-in" className="site-nav-signin">
                {t('signIn')}
              </NavLink>
              <NavLink to={isConfigured ? '/auth/sign-up' : '/app'}>{t('startLearning')}</NavLink>
            </>
          ) : null}
        </nav>
        {!phone ? <span className="site-nav-caret" aria-hidden /> : null}
        <div className="site-nav-cta">
          <div className="chrome-utilities" role="group" aria-label={t('langAndA11y')}>
            <LanguageToggle compact={phone} />
            <AccessibilityPanel iconOnly />
          </div>
          {phone ? (
            <button
              type="button"
              className="site-nav-menu"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} strokeWidth={1.8} aria-hidden /> : <Menu size={20} strokeWidth={1.8} aria-hidden />}
              <span className="sr-only">{menuOpen ? t('closeMenu') : t('openMenu')}</span>
            </button>
          ) : null}
          {!phone && user ? (
            <button type="button" className="btn-chip" onClick={() => navigate('/app')}>
              {t('dashboard')}
            </button>
          ) : null}
          {!phone && !user ? (
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
          ) : null}
        </div>
      </div>
    </header>
  );
}
