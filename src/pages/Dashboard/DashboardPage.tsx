import { Link } from 'react-router-dom';
import { achievementById } from '../../data/achievements';
import { MISSIONS, missingSkillsFor, recommendedMission } from '../../data/missions';
import { levelFromXp, levelProgress, nextThreshold } from '../../data/player';
import { FILES_TRACK, lessonNumber, unitNumber } from '../../data/tracks';
import { activeLesson, currentUnit, filesLessonProgress, unitProgress } from '../../engine/tutorial';
import { useOS } from '../../hooks/useOS';

export function DashboardPage() {
  const { progress } = useOS();
  const files = filesLessonProgress(progress);
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);
  const unitStats = unit ? unitProgress(unit, progress) : { done: 0, total: 0 };
  const level = levelFromXp(progress.xp);
  const next = nextThreshold(progress.xp);
  const pct = Math.round(levelProgress(progress.xp) * 100);
  const recent = progress.unlockedAchievementIds.slice(-3).reverse().map(achievementById).filter(Boolean);
  const mission = recommendedMission(progress);
  const fresh = files.done === 0 && !progress.onboardingComplete;

  return (
    <>
      <section className="dash-head">
        <p className="kicker">{fresh ? 'Welcome' : 'Welcome back'}</p>
        <h1>{fresh ? 'Your first lesson is ready.' : `Unit ${unitNumber(unit?.id ?? '')} · ${unit?.name}`}</h1>
        <p className="dash-lesson">
          Lesson {lessonNumber(lesson.id)} · {lesson.title}
        </p>
        <p className="lede">{lesson.subtitle}</p>
        <div className="cta-row">
          <Link className="btn-primary" to={`/app/lab/files/${lesson.id}`}>
            {files.done === 0 && progress.currentStepIndex === 0 ? 'Start lesson' : 'Continue lesson'}
          </Link>
          <Link className="btn-secondary" to="/app/learn/files">
            View path
          </Link>
        </div>
      </section>

      <section className="dash-split">
        <article className="panel">
          <p className="section-index">Course progress</p>
          <h2>
            {FILES_TRACK.name} · {files.percent}%
          </h2>
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
              <dt>Lessons</dt>
              <dd>
                {files.done} / {files.total}
              </dd>
            </div>
            <div>
              <dt>Unit</dt>
              <dd>
                {unitNumber(unit?.id ?? '')} of {FILES_TRACK.units.length}
              </dd>
            </div>
            <div>
              <dt>This unit</dt>
              <dd>
                {unitStats.done} / {unitStats.total}
              </dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <p className="section-index">Player</p>
          <h2>Level {level}</h2>
          <div
            className="meter"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="XP toward next player level"
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <dl className="stat-rows">
            <div>
              <dt>XP</dt>
              <dd>{progress.xp.toLocaleString()}</dd>
            </div>
            <div>
              <dt>{next ? 'Next level at' : 'Status'}</dt>
              <dd>{next ? `${next.toLocaleString()} XP` : 'Max level'}</dd>
            </div>
            <div>
              <dt>Commands run</dt>
              <dd>{progress.commandCount}</dd>
            </div>
          </dl>
          <p className="panel-note">Player level tracks XP across everything. Course progress tracks lessons only.</p>
        </article>
      </section>

      <section className="dash-split">
        <article className="panel">
          <p className="section-index">Recent achievements</p>
          {recent.length === 0 ? (
            <p className="empty-copy">
              Nothing yet. Running your first command earns one — it is the first thing lesson 1 asks for.
            </p>
          ) : (
            <ul className="mini-list">
              {recent.map((a) => (
                <li key={a!.id}>
                  <strong>{a!.title}</strong>
                  <span>{a!.description}</span>
                </li>
              ))}
            </ul>
          )}
          <Link className="text-link" to="/app/achievements">
            All achievements <span aria-hidden>→</span>
          </Link>
        </article>

        <article className="panel">
          <p className="section-index">Recommended mission</p>
          {mission ? (
            <>
              <h2>{mission.title}</h2>
              <p>{mission.scenario}</p>
              <p className="chip-row">
                <span className="chip">{mission.difficulty}</span>
                {mission.skills.map((s) => (
                  <span key={s} className="chip is-mono">
                    {s}
                  </span>
                ))}
              </p>
              <p className="reward">{mission.xp} XP</p>
              <Link className="btn-secondary" to={`/app/missions/${mission.id}`}>
                View mission
              </Link>
            </>
          ) : (
            <>
              <p className="empty-copy">
                {progress.completedMissionIds.length > 0
                  ? 'Every unlocked mission is done. New ones open as later units are built.'
                  : missionLockNote(progress)}
              </p>
              <Link className="text-link" to="/app/missions">
                See all missions <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </article>
      </section>
    </>
  );
}

/** Explains, in lesson terms, what stands between the learner and their first mission. */
function missionLockNote(progress: Parameters<typeof missingSkillsFor>[1]): string {
  const mission = MISSIONS.find((m) => !progress.completedMissionIds.includes(m.id));
  if (!mission) return 'Missions unlock as you finish lessons.';
  const missing = missingSkillsFor(mission, progress);
  if (!missing.length) return `${mission.title} is ready to start.`;
  return `Missions unlock as you finish lessons. ${mission.title} opens after: ${missing.join(', ')}.`;
}
