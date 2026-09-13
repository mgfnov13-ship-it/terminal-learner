import { Link, useNavigate } from 'react-router-dom';
import { MISSIONS, missingSkillsFor } from '../../data/missions';
import { useOS } from '../../hooks/useOS';

export function MissionsPage() {
  const navigate = useNavigate();
  const { progress } = useOS();
  const done = progress.completedMissionIds.length;
  const anyOpen = MISSIONS.some((m) => missingSkillsFor(m, progress).length === 0);

  return (
    <>
      <section className="path-head">
        <p className="kicker">Missions</p>
        <h1>Apply it to something messy</h1>
        <p className="lede">
          A lesson teaches one command. A mission drops you into a situation and checks the result: no steps, no
          prompts, no hand-holding. Each one gives the simulated disk its own starting mess.
        </p>
        <p className="hero-note">
          {done} of {MISSIONS.length} complete
        </p>
        {!anyOpen && (
          <p className="empty-copy">
            Every mission is still locked. Missions ask only for commands a lesson has already taught you — finish a
            couple of lessons and the first one opens.
          </p>
        )}
      </section>

      <ul className="mission-rows">
        {MISSIONS.map((m) => {
          const complete = progress.completedMissionIds.includes(m.id);
          const missing = missingSkillsFor(m, progress);
          const locked = missing.length > 0;
          return (
            <li key={m.id} className={`mission-row${complete ? ' is-done' : ''}${locked ? ' is-lock' : ''}`}>
              <div className="mission-main">
                <p className="unit-index">
                  {m.difficulty} · {m.xp} XP
                </p>
                <h2>{m.title}</h2>
                <p>{m.scenario}</p>
                <p className="chip-row">
                  {m.skills.map((s) => (
                    <span key={s} className="chip is-mono">
                      {s}
                    </span>
                  ))}
                </p>
              </div>
              <div className="mission-side">
                {complete && <p className="status is-open">Complete</p>}
                {locked ? (
                  <p className="lock-reason">
                    Needs first: <strong>{missing.join(', ')}</strong>
                  </p>
                ) : (
                  <button type="button" className="btn-secondary" onClick={() => navigate(`/app/missions/${m.id}`)}>
                    {complete ? 'Replay mission' : 'View mission'}
                  </button>
                )}
                {locked && (
                  <Link className="text-link" to="/app/learn/files">
                    Go to those lessons <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
