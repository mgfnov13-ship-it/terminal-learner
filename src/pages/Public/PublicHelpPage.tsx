import { Link } from 'react-router-dom';

const FAQ: [string, string][] = [
  ['What is Terminal Space?', 'A browser lab for learning command-line skills by actually using a simulated computer.'],
  ['Does it affect my real computer?', "No. Every command runs against a simulated filesystem inside this browser tab — nothing reaches your real machine."],
  ['Do I need to install anything?', 'No. Terminal Space runs entirely in your browser.'],
  ['Is the terminal real?', "It's a real simulator: a real command parser and a real virtual filesystem, modeled on a Windows-style prompt. It doesn't run your operating system's actual commands."],
  ['Do I need previous terminal experience?', 'No. The first lesson starts with what a prompt is.'],
  ['Is my progress saved?', "Yes, to your account when you're signed in — or to this browser only while you're not."],
  ['What happens if I make a mistake?', 'The Guide explains what happened and how to fix it. Nothing is permanent except what you choose to keep.'],
  ['Can I restart a lesson?', "Yes, at any time from the lesson footer. Your simulated disk resets to that lesson's starting folders; XP you already earned stays."],
];

export function PublicHelpPage() {
  return (
    <>
      <section className="path-head">
        <p className="kicker">Help</p>
        <h1>Frequently asked questions</h1>
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
        <p>Still have a question?</p>
        <Link className="text-link" to="/contact">
          Contact us <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
