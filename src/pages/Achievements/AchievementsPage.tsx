import { Link } from 'react-router-dom';
import { ACHIEVEMENTS } from '../../data/achievements';
import type { AchievementCategory } from '../../types';
import { useOS } from '../../hooks/useOS';

const CATEGORIES: AchievementCategory[] = ['Learning', 'Terminal', 'Files', 'Missions', 'Mastery'];

export function AchievementsPage() {
  const { progress } = useOS();
  const unlocked = new Set(progress.unlockedAchievementIds);

  return (
    <>
      <section className="path-head">
        <p className="kicker">Achievements</p>
        <h1>Milestones, not the point</h1>
        <p className="lede">
          These mark things you have already done. They do not gate lessons or missions — progress through the track is
          what unlocks content.
        </p>
        <p className="hero-note">
          {unlocked.size} of {ACHIEVEMENTS.length} earned
        </p>
      </section>

      {CATEGORIES.map((category) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === category);
        if (!items.length) return null;
        return (
          <section key={category} className="numbered">
            <p className="section-index">{category}</p>
            <div className="numbered-body">
              <ul className="ach-rows">
                {items.map((a) => {
                  const on = unlocked.has(a.id);
                  return (
                    <li key={a.id} className={on ? 'is-on' : undefined}>
                      <span className="ach-mark" aria-hidden>
                        {on ? '✓' : '·'}
                      </span>
                      <span className="ach-text">
                        <strong>{a.title}</strong>
                        <span>{a.description}</span>
                      </span>
                      <span className="ach-state">{on ? 'Earned' : 'Locked'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="path-foot">
        <p>Achievements come from ordinary use. The fastest way to collect them is to keep working through the track.</p>
        <Link className="text-link" to="/app/learn/files">
          Back to the Files path <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
