import { useOS, useOSApi } from '../../hooks/useOS';

export function SettingsApp() {
  return <SettingsBody />;
}

export function SettingsBody() {
  const { settings } = useOS();
  const api = useOSApi();

  const download = () => {
    const blob = new Blob([api.exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terminal-space-save.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings">
      <section>
        <h3>Appearance</h3>
        <fieldset className="seg">
          <legend>Theme</legend>
          {(['dark', 'light', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={settings.appearance === mode ? 'is-on' : ''}
              onClick={() => api.patchSettings({ appearance: mode })}
            >
              {mode === 'system' ? 'System' : mode === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </fieldset>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => api.patchSettings({ reducedMotion: e.target.checked })}
          />
          Reduce motion
        </label>
        <p className="muted">Typeface is fixed across the app so lessons and commands always look the same.</p>
      </section>

      <section>
        <h3>Terminal</h3>
        <label className="field">
          Font size
          <input
            type="range"
            min={12}
            max={20}
            value={settings.terminalFontSize}
            onChange={(e) => api.patchSettings({ terminalFontSize: Number(e.target.value) })}
          />
          <span>{settings.terminalFontSize}px</span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.showTimestamps}
            onChange={(e) => api.patchSettings({ showTimestamps: e.target.checked })}
          />
          Show timestamps on commands
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => api.patchSettings({ sound: e.target.checked })}
          />
          UI tones (generated in the browser)
        </label>
      </section>

      <section>
        <h3>Learning</h3>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.showHints}
            onChange={(e) => api.patchSettings({ showHints: e.target.checked })}
          />
          Show lesson hints
        </label>
        <button type="button" onClick={() => api.resetCurrentMission()}>
          Restart current lesson
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={() =>
            api.askConfirm({
              title: 'Reset all progress',
              body: 'XP, lessons, missions, achievements, and the virtual disk go back to factory. This cannot be undone.',
              confirmLabel: 'Reset progress',
              danger: true,
              onConfirm: () => api.resetProgress(),
            })
          }
        >
          Reset all progress
        </button>
      </section>

      <section>
        <h3>Data</h3>
        <p className="muted">Everything stays in this browser unless you export it.</p>
        <div className="row-actions">
          <button type="button" onClick={download}>
            Export progress
          </button>
          <label className="file-btn">
            Import progress
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                api.importProgress(await file.text());
                e.target.value = '';
              }}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() =>
            api.askConfirm({
              title: 'Reset simulated filesystem',
              body: 'Every folder and file you made is deleted and the disk returns to the current lesson or mission starting state. XP, lessons, and achievements are untouched.',
              confirmLabel: 'Reset filesystem',
              danger: true,
              onConfirm: () => api.resetVfs(),
            })
          }
        >
          Reset simulated filesystem
        </button>
      </section>
    </div>
  );
}
