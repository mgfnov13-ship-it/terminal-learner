import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

/**
 * N8 Terminal command nav — prompt glyph, wordmark as a path, destinations as
 * lowercase segments, cursor at the end. Public product-site nav: no app-only
 * concepts (missions, achievements, settings) live here.
 */
const LINKS = [
  { to: '/tracks', label: 'tracks' },
  { to: '/how-it-works', label: 'how it works' },
  { to: '/about', label: 'about' },
];

export function SiteNav() {
  const navigate = useNavigate();
  const { user, isConfigured } = useAuth();

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <NavLink to="/" className="site-mark" end>
          <span className="site-mark-prompt" aria-hidden>
            ~/
          </span>
          terminal-space
        </NavLink>
        <nav className="site-nav-links" aria-label="Main">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="site-nav-caret" aria-hidden />
        <div className="site-nav-cta">
          {user ? (
            <button type="button" className="btn-chip" onClick={() => navigate('/app')}>
              Dashboard
            </button>
          ) : (
            <>
              <NavLink to="/auth/sign-in" className="site-nav-signin">
                sign in
              </NavLink>
              <button
                type="button"
                className="btn-chip"
                onClick={() => navigate(isConfigured ? '/auth/sign-up' : '/app')}
              >
                Start learning
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
