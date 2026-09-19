import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PasswordInput } from '../Form/PasswordInput';
import { InlineNotice } from '../UI/Feedback';
import { Toggle } from '../UI/Primitives';
import { useAuth } from '../../features/auth/useAuth';
import { VALIDATION_COPY, validateConfirmPassword, validatePassword } from '../../features/auth/validation';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS, useOSApi } from '../../hooks/useOS';
import { ResetProgressModal } from './ResetProgressModal';

export function SettingsApp() {
  return <SettingsBody />;
}

export function SettingsBody() {
  const { settings } = useOS();
  const api = useOSApi();
  const { t, language, setLanguage, textScale, setTextScale, highContrast, setHighContrast } = usePreferences();
  const [showReset, setShowReset] = useState(false);

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
      <section id="appearance">
        <h3>{t('appearance')}</h3>
        <p className="settings-scope">{t('syncedAccount')}</p>
        <fieldset className="seg">
          <legend>{t('theme')}</legend>
          {(['dark', 'light', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={settings.appearance === mode}
              className={settings.appearance === mode ? 'is-on' : ''}
              onClick={() => api.patchSettings({ appearance: mode })}
            >
              {mode === 'system' ? t('system') : mode === 'dark' ? t('dark') : t('light')}
            </button>
          ))}
        </fieldset>
        <fieldset className="seg">
          <legend>{t('language')}</legend>
          <button type="button" lang="en" aria-pressed={language === 'en'} className={language === 'en' ? 'is-on' : ''} onClick={() => setLanguage('en')}>
            English
          </button>
          <button type="button" lang="ar" aria-pressed={language === 'ar'} className={language === 'ar' ? 'is-on' : ''} onClick={() => setLanguage('ar')}>
            العربية
          </button>
        </fieldset>
        <fieldset className="seg">
          <legend>{t('textSize')}</legend>
          {(['standard', 'large', 'larger'] as const).map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={textScale === size}
              aria-label={size === 'standard' ? t('textStandard') : size === 'large' ? t('textLarge') : t('textLarger')}
              className={textScale === size ? 'is-on' : ''}
              onClick={() => setTextScale(size)}
            >
              {size === 'standard' ? 'A' : size === 'large' ? 'A+' : 'A++'}
            </button>
          ))}
        </fieldset>
        <Toggle label={t('highContrast')} description={t('highContrastHint')} checked={highContrast} onChange={setHighContrast} />
        <Toggle
          label={t('reduceMotion')}
          description={t('reduceMotionHint')}
          checked={settings.reducedMotion}
          onChange={(checked) => api.patchSettings({ reducedMotion: checked })}
        />
      </section>

      <section id="terminal">
        <h3>{t('terminal')}</h3>
        <p className="settings-scope">{t('thisDevice')}</p>
        <label className="field">
          {t('textSize')}
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
          {t('showTimestamps')}
        </label>
        <label className="check">
          <input type="checkbox" checked={settings.sound} onChange={(e) => api.patchSettings({ sound: e.target.checked })} />
          {t('uiTones')}
        </label>
      </section>

      <section id="learning">
        <h3>{t('learning')}</h3>
        <p className="settings-scope">{t('syncedAccount')}</p>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.showHints}
            onChange={(e) => api.patchSettings({ showHints: e.target.checked })}
          />
          {t('showLessonHints')}
        </label>
        <button type="button" onClick={() => api.resetCurrentMission()}>
          {t('restartCurrentLesson')}
        </button>
        <button type="button" className="btn-danger" onClick={() => setShowReset(true)}>
          {t('resetAllProgress')}
        </button>
      </section>

      <AccountSection />

      <section id="data">
        <h3>{t('data')}</h3>
        <p className="muted">
          {t('dataStaysHere')}
        </p>
        <div className="row-actions">
          <button type="button" onClick={download}>
            {t('exportProgress')}
          </button>
          <label className="file-btn">
            {t('importProgress')}
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
              title: t('resetFilesystem'),
              body: t('resetFilesystemBody'),
              confirmLabel: t('resetFilesystemConfirm'),
              danger: true,
              onConfirm: () => api.resetVfs(),
            })
          }
        >
          {t('resetFilesystem')}
        </button>
      </section>

      {showReset && (
        <ResetProgressModal
          onCancel={() => setShowReset(false)}
          onConfirm={() => {
            api.resetProgress();
            setShowReset(false);
          }}
        />
      )}
    </div>
  );
}

function AccountSection() {
  const { isConfigured, user, signOut } = useAuth();
  const { t, bi } = usePreferences();

  if (!isConfigured) {
    return (
      <section id="account">
        <h3>{t('account')}</h3>
        <p className="muted">{t('notConnected')}</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section id="account">
        <h3>{t('account')}</h3>
        <p className="muted">{bi({ en: "You're not signed in.", ar: 'لست مسجّلاً للدخول.' })}</p>
      </section>
    );
  }

  return (
    <section id="account">
      <h3>{t('account')}</h3>
      <p className="settings-scope" dir="ltr">
        {user.email}
      </p>
      <ChangePasswordForm />
      <button
        type="button"
        onClick={() => signOut()}
        title={t('sessionOnlyLogout')}
      >
        {t('signOut')}
      </button>
      <p className="muted">{t('sessionOnlyLogout')}</p>
      <button type="button" className="btn-danger" disabled title={t('deleteUnavailable')}>
        {t('deleteAccountSoon')}
      </button>
      <p className="muted">
        <Link to="/contact">{t('contact')}</Link>
      </p>
    </section>
  );
}

function ChangePasswordForm() {
  const { updatePassword } = useAuth();
  const { t, bi } = usePreferences();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirm);
    const firstError = passwordError ?? confirmError;
    if (firstError) return setError(bi(VALIDATION_COPY[firstError]));
    setStatus('saving');
    setError(null);
    const { error: authError } = await updatePassword(password);
    if (authError) {
      setError(bi(authError));
      setStatus('idle');
      return;
    }
    setPassword('');
    setConfirm('');
    setStatus('done');
  }

  return (
    <form className="settings-password" onSubmit={onSubmit}>
      <label className="field" htmlFor="settings-new-password">
        {t('newPassword')}
      </label>
      <PasswordInput
        id="settings-new-password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        ariaInvalid={Boolean(error)}
      />
      <label className="field" htmlFor="settings-confirm-password">
        {t('confirmPassword')}
      </label>
      <PasswordInput
        id="settings-confirm-password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
      />
      {error && <InlineNotice tone="error" title={error} />}
      {status === 'done' && (
        <InlineNotice tone="success" title={t('passwordUpdated')} />
      )}
      <button type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? t('updating') : t('changePassword')}
      </button>
    </form>
  );
}
