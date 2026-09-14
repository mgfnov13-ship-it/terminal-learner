import { Award, BookOpen, Folder, SquareTerminal, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { ACHIEVEMENTS, achievementProgress } from '../../data/achievements';
import { ACHIEVEMENTS_COPY, earnedOf } from '../../data/pageCopy';
import type { AchievementCategory } from '../../types';
import { useOS } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { achievementDescription, achievementTitle } from '../../lib/localizeContent';

const CATEGORIES: AchievementCategory[] = ['Learning', 'Terminal', 'Files', 'Missions', 'Mastery'];

const CATEGORY_ICON: Record<AchievementCategory, typeof BookOpen> = {
  Learning: BookOpen,
  Terminal: SquareTerminal,
  Files: Folder,
  Missions: Target,
  Mastery: Award,
};

export function AchievementsPage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(t('achievements'));
  const { progress } = useOS();
  const unlocked = new Set(progress.unlockedAchievementIds);

  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(ACHIEVEMENTS_COPY.kicker)}</p>
        <h1>{bi(ACHIEVEMENTS_COPY.title)}</h1>
        <p className="lede">{bi(ACHIEVEMENTS_COPY.lede)}</p>
        <p className="hero-note">{bi(earnedOf(unlocked.size, ACHIEVEMENTS.length))}</p>
      </section>

      {CATEGORIES.map((category) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === category);
        if (!items.length) return null;
        const Icon = CATEGORY_ICON[category];
        return (
          <section key={category} className="numbered">
            <p className="section-index">{bi(ACHIEVEMENTS_COPY.categories[category])}</p>
            <div className="numbered-body">
              <ul className="badge-grid">
                {items.map((a) => {
                  const on = unlocked.has(a.id);
                  const prog = achievementProgress(a, progress);
                  const title = achievementTitle(a.id, language, a.title);
                  return (
                    <li key={a.id} className={`badge-card${on ? ' is-on' : ''}`}>
                      <span className="badge-mark" aria-hidden>
                        <Icon size={20} strokeWidth={1.7} />
                      </span>
                      <strong>{title}</strong>
                      <span className="badge-desc">{achievementDescription(a.id, language, a.description)}</span>
                      {!on && prog && (
                        <div
                          className="meter badge-meter"
                          role="progressbar"
                          aria-valuenow={prog.current}
                          aria-valuemin={0}
                          aria-valuemax={prog.target}
                          aria-label={bi({
                            en: `Progress toward ${title}`,
                            ar: `التقدّم نحو ${title}`,
                          })}
                        >
                          <span style={{ width: `${Math.round((prog.current / prog.target) * 100)}%` }} />
                        </div>
                      )}
                      <span className="badge-state">
                        {on ? t('earned') : prog ? `${prog.current} / ${prog.target}` : t('locked')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="path-foot">
        <p>{bi(ACHIEVEMENTS_COPY.foot)}</p>
        <Link className="text-link" to="/app/learn/files">
          {bi(ACHIEVEMENTS_COPY.backPath)} <DirArrow />
        </Link>
      </section>
    </>
  );
}
