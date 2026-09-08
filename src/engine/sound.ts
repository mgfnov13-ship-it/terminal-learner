let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

export function playTone(kind: 'ok' | 'xp' | 'error' | 'ui', enabled: boolean): void {
  if (!enabled) return;
  const ac = context();
  if (!ac) return;
  void ac.resume();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  const now = ac.currentTime;
  const map = {
    ui: { f: 420, d: 0.04, g: 0.03 },
    ok: { f: 620, d: 0.08, g: 0.04 },
    xp: { f: 740, d: 0.14, g: 0.045 },
    error: { f: 180, d: 0.12, g: 0.04 },
  } as const;
  const t = map[kind];
  osc.frequency.value = t.f;
  osc.type = kind === 'error' ? 'square' : 'sine';
  gain.gain.setValueAtTime(t.g, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + t.d);
  osc.start(now);
  osc.stop(now + t.d);
}
