import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <>
      <section className="path-head">
        <p className="kicker">About</p>
        <h1>Why Terminal Space exists</h1>
        <p className="lede">
          Terminal learning is usually passive. People watch a tutorial or copy a command from a cheat sheet without
          understanding where they are, what changed, or why the command worked.
        </p>
      </section>

      <section className="numbered">
        <p className="section-index">Philosophy</p>
        <div className="numbered-body">
          <h2>Learn. Try. Understand. Apply.</h2>
          <p>
            Terminal Space teaches through interaction. Every lesson pairs an explanation with a real simulated
            terminal, so the idea and the practice happen in the same breath. Missions then remove the guidance and
            ask you to apply what you've learned to an actual scenario.
          </p>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">What it is not</p>
        <div className="numbered-body">
          <h2>Not a game. Not a video course.</h2>
          <p>
            The simulated computer exists to teach, not to entertain. Terminal Space doesn't touch your real machine,
            doesn't need an install, and doesn't pretend to be more finished than it is — planned content is labeled
            planned, not hidden behind a fake progress bar.
          </p>
        </div>
      </section>

      <section className="closing">
        <p className="kicker">Ready to try it</p>
        <h2>Start with the Files track.</h2>
        <Link className="btn-chip" to="/tracks/files">
          See the Files track <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
