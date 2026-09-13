import { Link, useNavigate } from 'react-router-dom';
import { MISSIONS } from '../../data/missions';
import { FILES_TRACK, PLANNED_TRACKS, lessonNumber, trackLessons, unitNumber } from '../../data/tracks';
import { activeLesson, currentUnit, filesLessonProgress } from '../../engine/tutorial';
import { useOS } from '../../hooks/useOS';

const STAGES = [
  {
    step: '1.0',
    title: 'Learn',
    body: 'Academy explains one idea at a time — what a command is for, and what each part of it means.',
  },
  {
    step: '2.0',
    title: 'Try',
    body: 'You type the command into a real simulated terminal. Nothing is pre-filled and nothing runs itself.',
  },
  {
    step: '3.0',
    title: 'Feedback',
    body: 'The lab reads the filesystem afterwards. Any command that produces the right result is accepted; typos get explained.',
  },
  {
    step: '4.0',
    title: 'Master',
    body: 'Hints disappear as you go, then missions drop you into a messy scenario with no step-by-step guidance.',
  },
];

const REASONS = [
  ['An interactive terminal', 'You type every command yourself. Reading is not practising.'],
  ['A real virtual filesystem', 'Folders and files persist between commands, so mistakes have consequences you can see.'],
  ['Result-based checking', 'mkdir Projects and mkdir C:\\Users\\Student\\Projects both pass. There is no magic phrase to guess.'],
  ['Progressive hints', 'Ask for a nudge, or reveal the answer. You still have to run it.'],
  ['Practical missions', 'Sort a messy desktop, recover a lost file, scaffold a project.'],
  ['A safe sandbox', 'Nothing reaches your own machine. Delete anything you like.'],
];

export function HomePage() {
  const navigate = useNavigate();
  const { progress } = useOS();
  const lessons = trackLessons(FILES_TRACK);
  const files = filesLessonProgress(progress);
  const started = progress.onboardingComplete || files.done > 0;
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);
  const builtUnits = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Terminal Space</p>
          <h1>
            Learn the terminal by
            <br />
            actually using one.
          </h1>
          <p className="lede">
            Master files, navigation, and the everyday commands inside a safe simulated computer. You get a lesson on
            one side, a working command prompt on the other, and honest feedback on whatever you type.
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate(started ? `/academy/files/${lesson.id}` : '/learn/files')}
            >
              {started ? 'Continue progress' : 'Start learning'}
            </button>
            <Link className="btn-secondary" to="/learn/files">
              See the Files path
            </Link>
          </div>
          <p className="hero-note">
            {lessons.length} lessons · {MISSIONS.length} missions · no account, no install
          </p>
        </div>

        <div className="hero-proof">
          <div className="transcript" aria-label="Example terminal session">
            <p className="transcript-label">Terminal · simulated</p>
            <pre>
              <code>{`C:\\Users\\Student> mkdir Projects

C:\\Users\\Student> cd Projects

C:\\Users\\Student\\Projects> dir
 Directory of C:\\Users\\Student\\Projects
 0 File(s)

C:\\Users\\Student\\Projects> `}</code>
            </pre>
          </div>
          <aside className="proof-card">
            <p className="brief-label">Academy · step 3 of 5</p>
            <h2>Create directories</h2>
            <p>
              <strong>Your turn.</strong> Create a directory named Projects.
            </p>
            <p className="proof-card-note">Academy teaches you. Terminal lets you try it.</p>
          </aside>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">01 — How it works</p>
        <div className="numbered-body">
          <h2>Four things happen in every lesson.</h2>
          <ol className="stages">
            {STAGES.map((s) => (
              <li key={s.step}>
                <span className="stage-num">{s.step}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">02 — Tracks</p>
        <div className="numbered-body">
          <h2>One track is built. The rest are honest plans.</h2>
          <table className="spec">
            <thead>
              <tr>
                <th scope="col">Track</th>
                <th scope="col">Covers</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <Link to="/learn/files">{FILES_TRACK.name}</Link>
                </th>
                <td>{FILES_TRACK.tagline}</td>
                <td>
                  <span className="status is-open">Available</span>
                  <span className="status-detail">
                    {lessons.length} lessons · {builtUnits} of {FILES_TRACK.units.length} units built
                  </span>
                </td>
              </tr>
              {PLANNED_TRACKS.map((t) => (
                <tr key={t.id} className="is-planned">
                  <th scope="row">{t.name}</th>
                  <td>{t.tagline}</td>
                  <td>
                    <span className="status">Planned</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="table-note">Planned tracks are not clickable, because there is nothing behind them yet.</p>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">03 — Why this and not a video</p>
        <div className="numbered-body">
          <h2>You don't just read commands. You use them.</h2>
          <dl className="reasons">
            {REASONS.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="closing">
        {started ? (
          <>
            <p className="kicker">Continue learning</p>
            <h2>
              Unit {unitNumber(unit?.id ?? '')} · {unit?.name}
            </h2>
            <p className="closing-line">
              Lesson {lessonNumber(lesson.id)} · {lesson.title} — {files.done} of {files.total} lessons complete.
            </p>
            <Link className="btn-chip" to={`/academy/files/${lesson.id}`}>
              Continue <span aria-hidden>→</span>
            </Link>
          </>
        ) : (
          <>
            <p className="kicker">Ready when you are</p>
            <h2>Start with unit 1 · {FILES_TRACK.units[0].name}</h2>
            <p className="closing-line">
              First lesson: the prompt, the cursor, and your first command. It takes a couple of minutes.
            </p>
            <Link className="btn-chip" to="/learn/files">
              Start the Files track <span aria-hidden>→</span>
            </Link>
          </>
        )}
      </section>
    </>
  );
}
