import { Link, useNavigate } from 'react-router-dom';
import { lessonById } from '../../data/curriculum';
import { FILES_TRACK, lessonNumber } from '../../data/tracks';
import {
  activeLesson,
  currentUnit,
  filesLessonProgress,
  lessonState,
  unitProgress,
  unitState,
} from '../../engine/tutorial';
import { useOS } from '../../hooks/useOS';

const STATE_LABEL: Record<string, string> = {
  complete: 'Complete',
  current: 'In progress',
  available: 'Ready',
  locked: 'Locked',
  planned: 'Planned',
};

export function FilesPathPage() {
  const navigate = useNavigate();
  const { progress } = useOS();
  const files = filesLessonProgress(progress);
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);

  return (
    <>
      <section className="path-head">
        <p className="kicker">Track</p>
        <h1>{FILES_TRACK.name}</h1>
        <p className="lede">{FILES_TRACK.blurb}</p>
        <div className="path-stats">
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
          <p>
            {files.percent}% complete · {files.done} of {files.total} lessons · currently in unit{' '}
            {FILES_TRACK.units.findIndex((u) => u.id === unit?.id) + 1}, {unit?.name}
          </p>
        </div>
        <div className="cta-row">
          <Link className="btn-primary" to={`/academy/files/${lesson.id}`}>
            {files.done === 0 && progress.currentStepIndex === 0 ? 'Start lesson 1' : `Continue: ${lesson.title}`}
          </Link>
        </div>
      </section>

      <ol className="units">
        {FILES_TRACK.units.map((u, i) => {
          const state = unitState(u, progress);
          const stats = unitProgress(u, progress);
          return (
            <li key={u.id} className={`unit is-${state}`}>
              <div className="unit-head">
                <p className="unit-index">Unit {i + 1}</p>
                <h2>{u.name}</h2>
                <p className="unit-summary">{u.summary}</p>
                <p className="unit-meta">
                  <span className={`status${state === 'complete' || state === 'current' ? ' is-open' : ''}`}>
                    {STATE_LABEL[state]}
                  </span>
                  {u.lessonIds.length > 0 && (
                    <span className="status-detail">
                      {stats.done} / {stats.total} lessons
                    </span>
                  )}
                </p>
              </div>

              {u.lessonIds.length === 0 ? (
                <p className="unit-empty">
                  Written but not built yet. Nothing opens here, and nothing pretends to.
                </p>
              ) : (
                <ul className="lesson-rows">
                  {u.lessonIds.map((id) => {
                    const l = lessonById(id);
                    if (!l) return null;
                    const ls = lessonState(id, progress);
                    const open = ls !== 'locked';
                    return (
                      <li key={id} className={`lesson-row is-${ls}`}>
                        <button
                          type="button"
                          disabled={!open}
                          aria-current={ls === 'current' ? 'step' : undefined}
                          onClick={() => navigate(`/academy/files/${id}`)}
                        >
                          <span className="lesson-num">{lessonNumber(id)}</span>
                          <span className="lesson-text">
                            <strong>{l.title}</strong>
                            <span>{l.subtitle}</span>
                          </span>
                          <span className="lesson-state">
                            {ls === 'locked' ? 'Finish the previous lesson' : STATE_LABEL[ls]}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <section className="path-foot">
        <p>
          Finished the lessons you need? Missions apply them to a messy scenario with no step-by-step guidance.
        </p>
        <Link className="text-link" to="/missions">
          Practical missions <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
