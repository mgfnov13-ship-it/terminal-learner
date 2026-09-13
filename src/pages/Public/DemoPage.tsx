import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { executeCommand } from '../../engine/commandParser';
import { HOME } from '../../engine/paths';
import { VirtualFileSystem } from '../../engine/virtualFileSystem';

interface Line {
  cwd: string;
  raw: string;
  output: string;
  error?: boolean;
}

/**
 * Fully sandboxed: its own VirtualFileSystem instance, never the account's. No XP, no
 * completion, no sign-in — resets to a fresh disk on every page load.
 */
export function DemoPage() {
  const [vfs] = useState(() => VirtualFileSystem.seed());
  const [cwd, setCwd] = useState(HOME);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [ranDir, setRanDir] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const raw = input;
    const { result, cwd: nextCwd } = executeCommand(raw, vfs, cwd);
    setLines((prev) => [...prev, { cwd, raw, output: result.output, error: result.error }]);
    setCwd(nextCwd);
    setInput('');
    if (raw.trim().toLowerCase().startsWith('dir') || raw.trim().toLowerCase().startsWith('ls')) setRanDir(true);
  }

  return (
    <>
      <section className="path-head">
        <p className="kicker">Demo</p>
        <h1>Try it yourself — no account needed</h1>
        <p className="lede">
          This is a real, isolated simulated computer. Nothing you do here touches an account or saves anywhere —
          reload the page for a clean disk.
        </p>
      </section>

      <div className="demo-shell">
        <div className="demo-terminal" onClick={() => inputRef.current?.focus()}>
          <p className="transcript-label">Terminal · simulated</p>
          <div className="demo-lines">
            {lines.length === 0 && (
              <p className="demo-hint">
                Try typing <code>dir</code> and press Enter to see what's here.
              </p>
            )}
            {lines.map((l, i) => (
              <div key={i}>
                <p className="demo-prompt">
                  <span>{l.cwd}&gt;</span> {l.raw}
                </p>
                {l.output && <pre className={l.error ? 'is-error' : undefined}>{l.output}</pre>}
              </div>
            ))}
          </div>
          <form className="demo-input-row" onSubmit={onSubmit}>
            <span aria-hidden>{cwd}&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              autoComplete="off"
              spellCheck={false}
              aria-label="Demo terminal input"
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
        <aside className="proof-card">
          <p className="brief-label">Guide · try it</p>
          <h2>List a folder</h2>
          <p>
            <strong>Your turn.</strong> Type <code>dir</code> and press Enter.
          </p>
          <p className="proof-card-note">
            {ranDir
              ? "dir lists the contents of your current directory. That's the whole loop — read, try, see what changed."
              : 'dir lists the contents of your current directory.'}
          </p>
        </aside>
      </div>

      <section className="closing">
        <p className="kicker">Want the full learning path?</p>
        <h2>Files teaches this and a lot more.</h2>
        <Link className="btn-chip" to="/auth/sign-up">
          Create free account <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
