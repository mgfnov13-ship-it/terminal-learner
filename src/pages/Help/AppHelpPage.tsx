import { Link } from 'react-router-dom';

const FAQ: [string, string][] = [
  ['How do lessons check my work?', 'The lab watches the simulated filesystem after you run a command, not your keystrokes. Any command that produces the right result is accepted.'],
  ['What do hints do?', 'Hints are optional and progressive — ask for one at a time from the lesson footer. You can also reveal the full answer; you still have to type it yourself.'],
  ['Does revealing the answer cost XP?', 'Base XP for finishing a step is never taken back. Only a small unaided bonus is affected, and it can never be earned twice for the same step.'],
  ['How do I restart a lesson?', 'Use "Restart lesson" in the Lab footer. The simulated disk resets to that lesson\'s starting folders; XP you already earned stays.'],
  ['How do I reset a mission scenario?', 'Use "Reset scenario" while inside a mission. It restores the mission\'s starting files without touching your lesson progress.'],
  ['Is my progress saved?', 'Yes — to your account when you\'re signed in, or to this browser only while you\'re not.'],
  ['Can I use Terminal Space on my phone?', 'Yes. Below a certain width the Lab switches to a Terminal/Guide tab layout instead of a side-by-side view.'],
];

export function AppHelpPage() {
  return (
    <>
      <section className="path-head">
        <p className="kicker">Help</p>
        <h1>Using Terminal Space</h1>
        <p className="lede">Answers about lessons, hints, missions, and your progress.</p>
      </section>

      <section className="numbered">
        <div className="numbered-body">
          <dl className="reasons">
            {FAQ.map(([q, a]) => (
              <div key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="path-foot">
        <p>Something not covered here?</p>
        <Link className="text-link" to="/contact">
          Contact us <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
