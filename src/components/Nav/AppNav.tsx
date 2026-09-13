import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/learn', label: 'Learn' },
  { to: '/app/missions', label: 'Missions' },
  { to: '/app/progress', label: 'Progress' },
  { to: '/app/achievements', label: 'Achievements' },
];

/** Workspace nav for the authenticated app shell — distinct from the public site's terminal-command nav. */
export function AppNav() {
  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <NavLink to="/app" className="app-mark" aria-label="Terminal Space dashboard">
          <span className="app-mark-ico" aria-hidden>
            &gt;_
          </span>
          Terminal Space
        </NavLink>
        <nav className="app-nav-links" aria-label="App">
          {LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="app-nav-side">
          <NavLink to="/app/help" className="app-nav-icon" aria-label="Help">
            Help
          </NavLink>
          <NavLink to="/app/profile" className="app-nav-avatar" aria-label="Profile">
            ST
          </NavLink>
        </div>
      </div>
    </header>
  );
}
