import { Link } from 'react-router-dom';

const STAGES = [
  { step: '1.0', title: 'Learn', body: 'The Guide explains one idea at a time — what a command is for, and what each part of it means.' },
  { step: '2.0', title: 'Try', body: 'You type the command yourself into a real simulated terminal. Nothing is pre-filled and nothing runs itself.' },
  { step: '3.0', title: 'Feedback', body: 'Terminal Space watches the simulated filesystem afterward. Any command that produces the right result is accepted; mistakes get explained.' },
  { step: '4.0', title: 'Apply', body: 'Hints disappear as you go, then missions drop you into a messy scenario with no step-by-step guidance.' },
];

const DIFFERENCE = [
  ['Real practice', "Don't just watch commands. Run them."],
  ['Safe environment', 'Everything happens inside a simulated computer. Your real files are untouched.'],
  ["Understand, don't memorize", 'Terminal Space explains what a command does and why, not just what to type.'],
  ['Real missions', 'Apply several commands to an actual scenario, without a script to follow.'],
  ['Instant feedback', 'Mistakes become teaching moments instead of dead ends.'],
  ['Progressive difficulty', 'Guidance gradually disappears as your confidence grows.'],
];

export function HowItWorksPage() {
  return (
    <>
      <section className="path-head">
        <p className="kicker">How it works</p>
        <h1>Four things happen in every lesson.</h1>
        <p className="lede">Learn the terminal by actually using it, not by watching someone else use it.</p>
      </section>

      <section className="numbered">
        <div className="numbered-body">
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
        <p className="section-index">Why Terminal Space</p>
        <div className="numbered-body">
          <h2>Not a video. Not a cheat sheet.</h2>
          <dl className="reasons">
            {DIFFERENCE.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="closing">
        <p className="kicker">See it for yourself</p>
        <h2>Try one command, no account needed.</h2>
        <Link className="btn-chip" to="/demo">
          Try the demo <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
