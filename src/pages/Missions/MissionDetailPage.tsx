import { Link, useNavigate, useParams } from 'react-router-dom';
import { missingSkillsFor, missionById } from '../../data/missions';
import { useOS } from '../../hooks/useOS';
import { NotFoundPage } from '../NotFound/NotFoundPage';

/** Preview/detail screen shown before a mission launches into the Lab (/app/lab/mission/:id). */
export function MissionDetailPage() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { progress } = useOS();
  const mission = missionById(missionId);

  if (!mission) {
    return <NotFoundPage title="That mission does not exist" body={`No mission is registered as “${missionId}”.`} />;
  }

  const complete = progress.completedMissionIds.includes(mission.id);
  const missing = missingSkillsFor(mission, progress);
  const locked = missing.length > 0;

  return (
    <section className="mission-detail">
      <p className="kicker">Mission</p>
      <h1>{mission.title}</h1>
      <p className="chip-row">
        <span className="chip">{mission.difficulty}</span>
        {mission.skills.map((s) => (
          <span key={s} className="chip is-mono">
            {s}
          </span>
        ))}
      </p>
      <p className="lede">{mission.scenario}</p>

      <div className="panel">
        <p className="section-index">Briefing</p>
        <p>{mission.briefing}</p>
        <p className="objective">
          <strong>Objective.</strong> {mission.objective}
        </p>
        <p className="reward">{mission.xp} XP</p>
      </div>

      {complete && <p className="status is-open">Complete</p>}

      {locked ? (
        <div className="panel">
          <p className="lock-reason">
            Needs first: <strong>{missing.join(', ')}</strong>
          </p>
          <Link className="text-link" to="/app/learn/files">
            Go to those lessons <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <div className="cta-row">
          <button type="button" className="btn-primary" onClick={() => navigate(`/app/lab/mission/${mission.id}`)}>
            {complete ? 'Replay mission' : 'Start mission'}
          </button>
          <Link className="btn-secondary" to="/app/missions">
            All missions
          </Link>
        </div>
      )}
    </section>
  );
}
