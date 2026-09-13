import { Link } from 'react-router-dom';
import { ACHIEVEMENTS } from '../../data/achievements';
import { MISSIONS } from '../../data/missions';
import { FILES_TRACK } from '../../data/tracks';
import { commandsLearned, filesLessonProgress, unitProgress } from '../../engine/tutorial';
import { useOS } from '../../hooks/useOS';

/** Deeper progress detail than the dashboard: track completion, units, commands, missions, XP. */
export function ProgressPage() {
  const { progress } = useOS();
  const files = filesLessonProgress(progress);
  const commands = commandsLearned(progress);
  const builtUnits = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;
  const missionsDone = progress.completedMissionIds.length;
  const achievementsDone = progress.unlockedAchievementIds.length;

  return (
    <>
      <section className="path-head">
        <p className="kicker">Progress</p>
        <h1>Your Files progress</h1>
        <p className="lede">
          Everything here comes straight from what you've actually completed — no invented metrics.
        </p>
      </section>

      <section className="dash-split">
        <article className="panel">
          <p className="section-index">Files track</p>
          <h2>{files.percent}% of published content</h2>
          <div
            className="meter"
            role="progressbar"
            aria-valuenow={files.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Files track completion"
          >
            <span style={{ width: `${files.percent}%` }} />
          </div>
          <dl className="stat-rows">
            <div>
              <dt>Published lessons</dt>
              <dd>
                {files.done} / {files.total}
              </dd>
            </div>
            <div>
              <dt>Units available</dt>
              <dd>
                {builtUnits} of {FILES_TRACK.units.length}
              </dd>
            </div>
            <div>
              <dt>Missions complete</dt>
              <dd>
                {missionsDone} / {MISSIONS.length}
              </dd>
            </div>
            <div>
              <dt>Achievements earned</dt>
              <dd>
                {achievementsDone} / {ACHIEVEMENTS.length}
              </dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <p className="section-index">Units</p>
          <ul className="mini-list">
            {FILES_TRACK.units.map((u, i) => {
              const stats = unitProgress(u, progress);
              return (
                <li key={u.id}>
                  <strong>
                    Unit {i + 1} · {u.name}
                  </strong>
                  <span>{u.lessonIds.length > 0 ? `${stats.done} / ${stats.total} lessons` : 'Planned'}</span>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="panel">
        <p className="section-index">Commands learned</p>
        {commands.length === 0 ? (
          <p className="empty-copy">Complete your first lesson to start building this list.</p>
        ) : (
          <ul className="mini-list is-grid">
            {commands.map((c) => (
              <li key={c.name}>
                <strong>
                  <code>{c.name}</code>
                </strong>
                <span>{c.summary}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="path-foot">
        <p>Want the fuller picture, badge by badge?</p>
        <Link className="text-link" to="/app/achievements">
          View achievements <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
