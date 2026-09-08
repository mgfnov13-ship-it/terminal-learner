import { useOS, useOSApi } from '../../hooks/useOS';

export function SettingsApp() {
  const { settings } = useOS();
  const api = useOSApi();

  const download = () => {
    const blob = new Blob([api.exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terminal-academy-save.json';
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
        <fieldset className="seg">
          <legend>Font</legend>
          {([
            ['chivo', 'Chivo Mono'],
            ['ibm', 'IBM Plex Mono'],
            ['jetbrains', 'JetBrains Mono'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={settings.terminalFont === id ? 'is-on' : ''}
              onClick={() => api.patchSettings({ terminalFont: id })}
            >
              {label}
            </button>
          ))}
        </fieldset>
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
          Show mission hints
        </label>
        <button type="button" onClick={() => api.resetCurrentMission()}>
          Reset current mission
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={() =>
            api.askConfirm({
              title: 'Reset all progress',
              body: 'XP, missions, achievements, and the virtual disk go back to factory. This cannot be undone.',
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
              title: 'Reset virtual computer',
              body: 'Folders and files return to the factory tree. XP and missions stay.',
              confirmLabel: 'Reset virtual computer',
              danger: true,
              onConfirm: () => api.resetVfs(),
            })
          }
        >
          Reset virtual computer
        </button>
      </section>
    </div>
  );
}
