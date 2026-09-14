import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { DEMO_COPY, HOME_COPY } from '../../data/pageCopy';
import { executeCommand } from '../../engine/commandParser';
import { HOME } from '../../engine/paths';
import { VirtualFileSystem } from '../../engine/virtualFileSystem';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

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
  const { t, bi } = usePreferences();
  usePageTitle(t('demo'));
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
        <p className="kicker">{bi(DEMO_COPY.kicker)}</p>
        <h1>{bi(DEMO_COPY.title)}</h1>
        <p className="lede">{bi(DEMO_COPY.lede)}</p>
      </section>

      <div className="demo-shell">
        <div className="demo-terminal" dir="ltr" lang="en" onClick={() => inputRef.current?.focus()}>
          <p className="transcript-label">{bi(HOME_COPY.transcriptLabel)}</p>
          <div className="demo-lines">
            {lines.length === 0 && (
              <p className="demo-hint">
                {bi(DEMO_COPY.hint).split('dir').map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <code>dir</code>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
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
              dir="ltr"
              aria-label={bi(DEMO_COPY.inputAria)}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
        <aside className="proof-card">
          <p className="brief-label">{bi(DEMO_COPY.briefLabel)}</p>
          <h2>{bi(DEMO_COPY.proofTitle)}</h2>
          <p>
            <strong>{t('yourTurn')}</strong> {bi(DEMO_COPY.proofBody).split('dir').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <code>dir</code>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
          <p className="proof-card-note">{bi(ranDir ? DEMO_COPY.after : DEMO_COPY.before)}</p>
        </aside>
      </div>

      <section className="closing">
        <p className="kicker">{bi(DEMO_COPY.closingKicker)}</p>
        <h2>{bi(DEMO_COPY.closingTitle)}</h2>
        <Link className="btn-chip" to="/auth/sign-up">
          {bi(DEMO_COPY.createAccount)} <DirArrow />
        </Link>
      </section>
    </>
  );
}
