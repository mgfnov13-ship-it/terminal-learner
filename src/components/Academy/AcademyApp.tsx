import { ACHIEVEMENTS } from '../../data/achievements';
import { LEVELS, currentMission, missionsForLevel, nextThreshold } from '../../data/missions';
import { useOS, useOSApi } from '../../hooks/useOS';

export function AcademyApp() {
  const { progress, settings } = useOS();
  const api = useOSApi();
  const mission = currentMission(progress.completedMissionIds);
  const next = nextThreshold(progress.xp);
  const pct = next ? Math.min(100, Math.round((progress.xp / next) * 100)) : 100;
  const level = LEVELS.find((l) => l.id === Math.max(1, [...LEVELS].reverse().find((l) => progress.xp >= l.lockedUntilXp)?.id ?? 1));

  return (
    <div className="academy">
      <header className="academy-hero">
        <p className="kicker">Files track</p>
        <h2>Level {level?.id} · {level?.name}</h2>
        <div className="xp-line">
          <span>{progress.xp} XP</span>
          <span>{next ? `${next} to next level` : 'Top of the table'}</span>
        </div>
        <div className="xp-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </header>

      {mission ? (
        <section className="brief">
          <p className="brief-label">Current mission</p>
          <h3>{mission.title}</h3>
          <p>{mission.briefing}</p>
          <p className="objective">
            <strong>Objective.</strong> {mission.objective}
          </p>
          {settings.showHints && <p className="hint">{mission.hint}</p>}
          <p className="reward">{mission.xp} XP</p>
          <button type="button" className="btn-primary" onClick={() => api.openApp('terminal')}>
            Open Terminal
          </button>
        </section>
      ) : (
        <section className="brief">
          <h3>Files track complete</h3>
          <p>You finished every Level 1 mission. Later levels stay locked until they ship.</p>
        </section>
      )}

      <section>
        <h3 className="list-head">Missions</h3>
        <ol className="mission-list">
          {missionsForLevel(1).map((m) => {
            const done = progress.completedMissionIds.includes(m.id);
            const current = mission?.id === m.id;
            return (
              <li key={m.id} className={done ? 'is-done' : current ? 'is-now' : 'is-lock'}>
                <span>{m.title}</span>
                <span>{done ? 'Done' : current ? `${m.xp} XP` : 'Locked'}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h3 className="list-head">Levels</h3>
        <ul className="level-list">
          {LEVELS.map((l) => {
            const open = progress.xp >= l.lockedUntilXp;
            return (
              <li key={l.id} className={open && l.implemented ? 'is-open' : 'is-lock'}>
                <strong>
                  Level {l.id} · {l.name}
                </strong>
                <span>{l.implemented ? (open ? l.subtitle : `Opens at ${l.lockedUntilXp} XP`) : l.subtitle}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="list-head">Achievements</h3>
        {progress.unlockedAchievementIds.length === 0 && (
          <p className="empty-copy">No achievements yet. Finish a mission to earn the first one.</p>
        )}
        <ul className="ach-list">
          {ACHIEVEMENTS.map((a) => {
            const on = progress.unlockedAchievementIds.includes(a.id);
            return (
              <li key={a.id} className={on ? 'is-on' : ''}>
                <strong>{a.title}</strong>
                <span>{a.description}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
