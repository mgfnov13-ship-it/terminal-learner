import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { ACHIEVEMENTS } from '../../data/achievements';
import { MISSIONS } from '../../data/missions';
import { PROGRESS_COPY, unitLessonsCount } from '../../data/pageCopy';
import { FILES_TRACK } from '../../data/tracks';
import { commandsLearned, filesLessonProgress, unitProgress } from '../../engine/tutorial';
import { useOS } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { commandSummary, unitName } from '../../lib/localizeContent';

/** Deeper progress detail than the dashboard: track completion, units, commands, missions, XP. */
export function ProgressPage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(t('progress'));
  const { progress } = useOS();
  const files = filesLessonProgress(progress);
  const commands = commandsLearned(progress);
  const builtUnits = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;
  const missionsDone = progress.completedMissionIds.length;
  const achievementsDone = progress.unlockedAchievementIds.length;

  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(PROGRESS_COPY.kicker)}</p>
        <h1>{bi(PROGRESS_COPY.title)}</h1>
        <p className="lede">{bi(PROGRESS_COPY.lede)}</p>
      </section>

      <section className="dash-split">
        <article className="panel">
          <p className="section-index">{bi(PROGRESS_COPY.filesTrack)}</p>
          <h2>
            {files.percent}% {bi(PROGRESS_COPY.publishedPct)}
          </h2>
          <div
            className="meter"
            role="progressbar"
            aria-valuenow={files.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={bi(PROGRESS_COPY.completionAria)}
          >
            <span style={{ width: `${files.percent}%` }} />
          </div>
          <dl className="stat-rows">
            <div>
              <dt>{bi(PROGRESS_COPY.publishedLessons)}</dt>
              <dd>
                {files.done} / {files.total}
              </dd>
            </div>
            <div>
              <dt>{bi(PROGRESS_COPY.unitsAvailable)}</dt>
              <dd>
                {builtUnits} {t('of')} {FILES_TRACK.units.length}
              </dd>
            </div>
            <div>
              <dt>{bi(PROGRESS_COPY.missionsComplete)}</dt>
              <dd>
                {missionsDone} / {MISSIONS.length}
              </dd>
            </div>
            <div>
              <dt>{bi(PROGRESS_COPY.achievementsEarned)}</dt>
              <dd>
                {achievementsDone} / {ACHIEVEMENTS.length}
              </dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <p className="section-index">{bi(PROGRESS_COPY.units)}</p>
          <ul className="mini-list">
            {FILES_TRACK.units.map((u, i) => {
              const stats = unitProgress(u, progress);
              return (
                <li key={u.id}>
                  <strong>
                    {t('unit')} {i + 1} · {unitName(u.id, language, u.name)}
                  </strong>
                  <span>
                    {u.lessonIds.length > 0 ? bi(unitLessonsCount(stats.done, stats.total)) : t('planned')}
                  </span>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="panel">
        <p className="section-index">{bi(PROGRESS_COPY.commandsLearned)}</p>
        {commands.length === 0 ? (
          <p className="empty-copy">{bi(PROGRESS_COPY.emptyCommands)}</p>
        ) : (
          <ul className="mini-list is-grid">
            {commands.map((c) => (
              <li key={c.name}>
                <strong>
                  <code>{c.name}</code>
                </strong>
                <span>{commandSummary(c.name, language, c.summary)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="path-foot">
        <p>{bi(PROGRESS_COPY.fuller)}</p>
        <Link className="text-link" to="/app/achievements">
          {bi(PROGRESS_COPY.viewAchievements)} <DirArrow />
        </Link>
      </section>
    </>
  );
}
