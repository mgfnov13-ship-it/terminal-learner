import { NavLink } from 'react-router-dom';

/**
 * N8 Terminal command nav — prompt glyph, wordmark as a path, destinations as
 * lowercase segments, cursor at the end. Deliberately not the lab taskbar.
 */
const LINKS = [
  { to: '/learn/files', label: 'learn' },
  { to: '/missions', label: 'missions' },
  { to: '/achievements', label: 'achievements' },
  { to: '/dashboard', label: 'dashboard' },
  { to: '/settings', label: 'settings' },
];

export function SiteNav() {
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
      </div>
    </header>
  );
}
