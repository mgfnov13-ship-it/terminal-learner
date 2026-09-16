import { useId, useRef } from 'react';
import { Accessibility, Moon, Sun, X } from 'lucide-react';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS, useOSApi } from '../../hooks/useOS';
import { Toggle } from '../UI/Primitives';

export function AccessibilityPanel({ iconOnly = false }: { iconOnly?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogTitleId = useId();
  const {
    highContrast,
    language,
    setHighContrast,
    setLanguage,
    setTextScale,
    t,
    textScale,
  } = usePreferences();
  const { settings } = useOS();
  const api = useOSApi();

  return (
    <>
      <button
        ref={triggerRef}
        className="utility-button"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={t('accessibility')}
      >
        <Accessibility className="icon" size={18} strokeWidth={1.7} aria-hidden="true" />
        {!iconOnly && <span>{t('accessibility')}</span>}
      </button>
      <dialog
        className="preferences-dialog"
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        onClose={() => triggerRef.current?.focus()}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className="preferences-dialog__head">
          <div>
            <h2 id={dialogTitleId}>{t('accessibility')}</h2>
            <p>{t('a11yIntro')}</p>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={t('close')}
          >
            <X className="icon" size={18} aria-hidden="true" />
          </button>
        </div>

        <fieldset className="preference-group">
          <legend>{t('language')}</legend>
          <div className="segmented-control">
            <button type="button" aria-pressed={language === 'ar'} onClick={() => setLanguage('ar')}>
              <span lang="ar">العربية</span>
            </button>
            <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>
              <span lang="en">English</span>
            </button>
          </div>
        </fieldset>

        <fieldset className="preference-group">
          <legend>{t('theme')}</legend>
          <div className="choice-grid">
            <button
              type="button"
              aria-pressed={settings.appearance === 'light'}
              onClick={() => api.patchSettings({ appearance: 'light' })}
            >
              <Sun className="icon" size={16} aria-hidden="true" />
              {t('light')}
            </button>
            <button
              type="button"
              aria-pressed={settings.appearance === 'dark'}
              onClick={() => api.patchSettings({ appearance: 'dark' })}
            >
              <Moon className="icon" size={16} aria-hidden="true" />
              {t('dark')}
            </button>
            <button
              type="button"
              aria-pressed={settings.appearance === 'system'}
              onClick={() => api.patchSettings({ appearance: 'system' })}
            >
              {t('system')}
            </button>
          </div>
        </fieldset>

        <fieldset className="preference-group">
          <legend>{t('textSize')}</legend>
          <div className="segmented-control">
            {(
              [
                { size: 'standard' as const, mark: 'A', name: t('textStandard') },
                { size: 'large' as const, mark: 'A+', name: t('textLarge') },
                { size: 'larger' as const, mark: 'A++', name: t('textLarger') },
              ] as const
            ).map(({ size, mark, name }) => (
              <button
                key={size}
                type="button"
                aria-label={name}
                aria-pressed={textScale === size}
                onClick={() => setTextScale(size)}
              >
                <span aria-hidden="true">{mark}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="preference-group">
          <Toggle
            label={t('highContrast')}
            description={t('highContrastHint')}
            checked={highContrast}
            onChange={setHighContrast}
          />
          <Toggle
            label={t('reduceMotion')}
            description={t('reduceMotionHint')}
            checked={settings.reducedMotion}
            onChange={(checked: boolean) => api.patchSettings({ reducedMotion: checked })}
          />
        </div>

        <button type="button" className="btn-primary" onClick={() => dialogRef.current?.close()}>
          {t('close')}
        </button>
      </dialog>
    </>
  );
}

/** Small language toggle for chrome that already has the full accessibility dialog nearby. */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = usePreferences();
  const other = language === 'en' ? 'ar' : 'en';
  return (
    <button
      type="button"
      className="utility-button"
      onClick={() => setLanguage(other)}
      aria-label={t('language')}
    >
      {other === 'ar' ? (
        <span lang="ar">{compact ? 'AR' : 'العربية'}</span>
      ) : (
        <span lang="en">EN</span>
      )}
    </button>
  );
}
