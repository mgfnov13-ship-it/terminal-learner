import { useOSApi } from '../../hooks/useOS';

export function WelcomeScreen() {
  const api = useOSApi();
  return (
    <main className="welcome">
      <p className="welcome-mark">TA</p>
      <h1>Terminal Academy</h1>
      <p>
        This is a virtual computer. Commands you type stay in the browser. Nothing reaches your real
        files, shell, or network.
      </p>
      <p>Finish missions to earn XP. File Explorer shows the same disk Terminal writes to.</p>
      <button type="button" className="btn-primary" onClick={() => api.finishWelcome()}>
        Start Academy
      </button>
    </main>
  );
}
