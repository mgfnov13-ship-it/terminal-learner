import { useOSApi } from '../../hooks/useOS';

export function WelcomeScreen() {
  const api = useOSApi();
  return (
    <main className="welcome">
      <p className="welcome-mark">TS</p>
      <h1>Terminal Space</h1>
      <p>You’ll learn the terminal by actually using one.</p>
      <p>Everything here runs inside a safe simulated computer, so experiment freely. Commands never leave this browser.</p>
      <button type="button" className="btn-primary" onClick={() => api.finishWelcome()}>
        Start Academy
      </button>
    </main>
  );
}
