import { SettingsBody } from '../../components/Settings/SettingsApp';

export function SettingsPage() {
  return (
    <>
      <section className="path-head">
        <p className="kicker">Settings</p>
        <h1>Settings</h1>
        <p className="lede">
          Everything here is stored in this browser. Resets are irreversible and each one asks first, so you can see
          exactly what it clears.
        </p>
      </section>
      <section className="settings-page">
        <SettingsBody />
      </section>
    </>
  );
}
