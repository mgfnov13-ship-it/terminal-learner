import { Link, useNavigate } from 'react-router-dom';
import { FILES_TRACK, trackLessons } from '../../data/tracks';
import { useAuth } from '../../features/auth/useAuth';

const SKILLS = [
  'Reading a prompt and knowing where you are',
  'Moving between folders with cd and paths',
  'Creating folders and files exactly where you want them',
  'Renaming, copying, moving, and deleting safely',
];

export function TracksFilesPage() {
  const { user, isConfigured } = useAuth();
  const navigate = useNavigate();
  const lessons = trackLessons(FILES_TRACK);
  const builtUnits = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;

  function goStart() {
    if (user) {
      navigate('/app/learn/files');
      return;
    }
    navigate(isConfigured ? '/auth/sign-up' : '/app');
  }

  return (
    <>
      <section className="path-head">
        <p className="kicker">Track</p>
        <h1>{FILES_TRACK.name}</h1>
        <p className="lede">{FILES_TRACK.blurb}</p>
        <div className="cta-row">
          <button type="button" className="btn-primary" onClick={goStart}>
            {user ? 'Continue Files' : 'Start Files'}
          </button>
        </div>
        <p className="hero-note">
          {lessons.length} published lessons · {builtUnits} of {FILES_TRACK.units.length} units available
        </p>
      </section>

      <section className="numbered">
        <p className="section-index">Who this is for</p>
        <div className="numbered-body">
          <h2>Anyone who has never opened a terminal on purpose.</h2>
          <p>No prior command-line experience assumed. You'll learn what a prompt is before you're asked to use one.</p>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">Key skills</p>
        <div className="numbered-body">
          <h2>What you'll learn</h2>
          <dl className="reasons">
            {SKILLS.map((s) => (
              <div key={s}>
                <dt>{s.split(' ').slice(0, 3).join(' ')}</dt>
                <dd>{s}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">Curriculum</p>
        <div className="numbered-body">
          <h2>Eight units. Four published, four planned.</h2>
          <ol className="units">
            {FILES_TRACK.units.map((u, i) => (
              <li key={u.id} className={u.lessonIds.length > 0 ? 'unit is-available' : 'unit is-planned'}>
                <div className="unit-head">
                  <p className="unit-index">Unit {i + 1}</p>
                  <h2>{u.name}</h2>
                  <p className="unit-summary">{u.summary}</p>
                  <p className="unit-meta">
                    <span className={`status${u.lessonIds.length > 0 ? ' is-open' : ''}`}>
                      {u.lessonIds.length > 0 ? 'Available' : 'Planned'}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">How it works</p>
        <div className="numbered-body">
          <h2>Lessons teach. Missions apply.</h2>
          <p>
            Each lesson teaches one idea, then asks you to run the command yourself in a real simulated terminal.
            Missions come after — no step-by-step guidance, just a scenario and a result to reach.
          </p>
        </div>
      </section>

      <section className="closing">
        <p className="kicker">Ready when you are</p>
        <h2>Start with unit 1 · {FILES_TRACK.units[0].name}</h2>
        <button type="button" className="btn-chip" onClick={goStart}>
          {user ? 'Continue Files' : 'Start Files'} <span aria-hidden>→</span>
        </button>
      </section>

      <p className="table-note">
        <Link to="/tracks">All tracks</Link>
      </p>
    </>
  );
}
