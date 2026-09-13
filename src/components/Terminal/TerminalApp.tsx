import { useEffect, useRef, useState } from 'react';
import { useOS, useOSApi } from '../../hooks/useOS';

interface LogRow {
  prompt: string;
  command: string;
  output?: string;
  error?: boolean;
  stamp?: string;
}

export function TerminalApp() {
  const { cwd, settings, highlightTerminal, awaitingInput, terminalFocusNonce } = useOS();
  const api = useOSApi();
  const [log, setLog] = useState<LogRow[]>([]);
  const [value, setValue] = useState('');
  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [log]);

  useEffect(() => {
    input.current?.focus();
  }, []);

  // Academy's "Focus Terminal" button asks for the cursor without typing anything.
  useEffect(() => {
    if (terminalFocusNonce > 0) input.current?.focus();
  }, [terminalFocusNonce]);

  const prompt = `${cwd}>`;

  const submit = (line: string) => {
    const trimmed = line.trim();
    if (trimmed) history.current.push(trimmed);
    histIdx.current = -1;
    const stamp = settings.showTimestamps
      ? new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : undefined;
    if (!trimmed) {
      setLog((l) => [...l, { prompt, command: '', stamp }]);
      return;
    }
    const result = api.run(line);
    if (result.clear) {
      setLog([]);
      setValue('');
      return;
    }
    setLog((l) => [...l, { prompt, command: line, output: result.output, error: result.error, stamp }]);
    setValue('');
  };

  return (
    <div
      className={`terminal${highlightTerminal || awaitingInput ? ' is-awaiting' : ''}`}
      style={{ fontSize: settings.terminalFontSize }}
      onClick={() => input.current?.focus()}
    >
      <div className="term-where">
        <span>Current directory:</span>
        <strong>{cwd}</strong>
        <button
          type="button"
          className="term-focus"
          onClick={(e) => {
            e.stopPropagation();
            input.current?.focus();
          }}
        >
          Focus Terminal <kbd>⌘1</kbd>
        </button>
      </div>
      <div className="terminal-log" ref={scroller}>
        <p className="terminal-banner">
          Terminal Space [Version 1.0.0]
          {'\n'}(c) Simulated environment. Commands do not leave this browser.
        </p>
        {log.map((row, i) => (
          <div key={i} className="term-block">
            <p className="term-line">
              {row.stamp ? <span className="term-stamp">{row.stamp} </span> : null}
              <span className="term-prompt">{row.prompt}</span>
              {row.command}
            </p>
            {row.output ? <pre className={row.error ? 'is-error' : undefined}>{row.output}</pre> : null}
          </div>
        ))}
      </div>
      <form
        className="terminal-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <label className="prompt" htmlFor="term-in">
          {prompt}
        </label>
        <input
          id="term-in"
          ref={input}
          value={value}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (!history.current.length) return;
              histIdx.current =
                histIdx.current < 0 ? history.current.length - 1 : Math.max(0, histIdx.current - 1);
              setValue(history.current[histIdx.current] ?? '');
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (histIdx.current < 0) return;
              histIdx.current += 1;
              if (histIdx.current >= history.current.length) {
                histIdx.current = -1;
                setValue('');
              } else {
                setValue(history.current[histIdx.current] ?? '');
              }
            } else if (e.key === 'Tab') {
              e.preventDefault();
              const next = api.autocomplete(value);
              if (next) setValue(next);
            } else if (e.key === 'l' && e.ctrlKey) {
              e.preventDefault();
              setLog([]);
            } else if (e.key === 'c' && e.ctrlKey) {
              e.preventDefault();
              setValue('');
            }
          }}
        />
        <span className="term-caret" aria-hidden />
      </form>
    </div>
  );
}
