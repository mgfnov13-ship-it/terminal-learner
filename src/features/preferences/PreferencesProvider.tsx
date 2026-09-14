import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useOS, useOSApi } from '../../hooks/useOS';
import {
  direction,
  localize,
  message,
  type Language,
  type LocalizedText,
  type MessageKey,
} from '../../lib/i18n';
import { SITE_META } from '../../data/pageCopy';
import { readStored, safeLocalStorageSet } from '../../lib/storageSafe';

export type TextScale = 'standard' | 'large' | 'larger';

type PreferencesValue = {
  language: Language;
  setLanguage: (value: Language) => void;
  textScale: TextScale;
  setTextScale: (value: TextScale) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  t: (key: MessageKey) => string;
  bi: (value: LocalizedText) => string;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

const LANG_KEY = 'ts_language';
const SCALE_KEY = 'ts_text_scale';
const CONTRAST_KEY = 'ts_high_contrast';

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { settings } = useOS();
  const api = useOSApi();
  const [language, setLanguageState] = useState<Language>(() =>
    readStored<Language>(LANG_KEY, 'en', ['ar', 'en']),
  );
  const [textScale, setTextScaleState] = useState<TextScale>(() =>
    readStored<TextScale>(SCALE_KEY, 'standard', ['standard', 'large', 'larger']),
  );
  const [highContrast, setHighContrastState] = useState(
    () => readStored<'true' | 'false'>(CONTRAST_KEY, 'false', ['true', 'false']) === 'true',
  );

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    api.patchSettings({ language: value });
  };
  const setTextScale = (value: TextScale) => {
    setTextScaleState(value);
    api.patchSettings({ textScale: value });
  };
  const setHighContrast = (value: boolean) => {
    setHighContrastState(value);
    api.patchSettings({ highContrast: value });
  };

  // Cloud/OS hydrate wins when the signed-in save already has a stored preference.
  useEffect(() => {
    if (settings.language && settings.language !== language) setLanguageState(settings.language);
  }, [settings.language]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (settings.textScale && settings.textScale !== textScale) setTextScaleState(settings.textScale);
  }, [settings.textScale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (settings.highContrast !== highContrast) setHighContrastState(settings.highContrast);
  }, [settings.highContrast]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = api.resolvedTheme();

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      root.lang = language;
      root.dir = direction(language);
      root.dataset.theme = theme;
      root.dataset.textScale = textScale;
      root.dataset.contrast = highContrast ? 'high' : 'standard';
      root.dataset.motion = settings.reducedMotion || media.matches ? 'reduce' : 'standard';
    };
    apply();
    const description = localize(language, SITE_META.description);
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    const ogTitle = language === 'ar' ? 'تيرمنال سبيس — تعلّم الطرفية بالممارسة' : 'Terminal Space — Learn the Terminal by Using It';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', ogTitle);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', ogTitle);
    media.addEventListener('change', apply);
    safeLocalStorageSet(LANG_KEY, language);
    safeLocalStorageSet(SCALE_KEY, textScale);
    safeLocalStorageSet(CONTRAST_KEY, String(highContrast));
    return () => media.removeEventListener('change', apply);
  }, [highContrast, language, settings.reducedMotion, textScale, theme]);

  const value = useMemo<PreferencesValue>(
    () => ({
      language,
      setLanguage,
      textScale,
      setTextScale,
      highContrast,
      setHighContrast,
      t: (key) => message(language, key),
      bi: (text) => localize(language, text),
    }),
    [highContrast, language, textScale],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside PreferencesProvider');
  return ctx;
}
