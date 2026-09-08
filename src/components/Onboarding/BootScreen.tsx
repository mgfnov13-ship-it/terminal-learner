import { useEffect, useState } from 'react';
import { useOSApi } from '../../hooks/useOS';

export function BootScreen() {
  const api = useOSApi();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const t = Math.min(100, Math.round(((Date.now() - start) / 1600) * 100));
      setPct(t);
      if (t >= 100) {
        window.clearInterval(id);
        api.finishBoot();
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [api]);

  return (
    <main className="boot">
      <p className="welcome-mark">TA</p>
      <h1>Terminal Academy</h1>
      <p>Starting virtual computer…</p>
      <div className="boot-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <button type="button" className="text-btn" onClick={() => api.skipBoot()}>
        Skip
      </button>
    </main>
  );
}
