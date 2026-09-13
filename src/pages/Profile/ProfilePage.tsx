import { useNavigate } from 'react-router-dom';
import { levelFromXp } from '../../data/player';
import { useAuth } from '../../features/auth/useAuth';
import { useOS } from '../../hooks/useOS';

export function ProfilePage() {
  const { user, profile, isConfigured, signOut } = useAuth();
  const { progress } = useOS();
  const navigate = useNavigate();
  const level = levelFromXp(progress.xp);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <>
      <section className="path-head">
        <p className="kicker">Profile</p>
        <h1>Profile</h1>
      </section>

      <section className="panel">
        <div className="profile-row">
          <span className="app-nav-avatar" aria-hidden>
            {(profile?.display_name ?? user?.email ?? 'ST').slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong>{profile?.display_name ?? (user ? user.email : 'Local development mode')}</strong>
            <p className="panel-note">
              {user
                ? user.email
                : isConfigured
                  ? 'Not signed in.'
                  : "No account backend is connected — you're using Terminal Space in local mode. Progress stays in this browser."}
            </p>
          </div>
        </div>
        <dl className="stat-rows">
          <div>
            <dt>Player level</dt>
            <dd>Level {level}</dd>
          </div>
          <div>
            <dt>XP</dt>
            <dd>{progress.xp.toLocaleString()}</dd>
          </div>
        </dl>
      </section>

      {user && (
        <div className="cta-row">
          <button type="button" className="btn-secondary" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
