import { SettingsBody } from '../../components/Settings/SettingsApp';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

export function SettingsPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('settings'));
  return (
    <>
      <section className="path-head">
        <p className="kicker">{t('settings')}</p>
        <h1>{t('settings')}</h1>
        <p className="lede">
          {bi({
            en: "Some settings sync to your account when you're signed in; others stay on this device. Resets are irreversible and each one asks first, so you can see exactly what it clears.",
            ar: 'بعض الإعدادات تُزامن إلى حسابك عند تسجيل الدخول؛ وأخرى تبقى على هذا الجهاز. عمليات إعادة الضبط لا تُعكس، وكل واحدة تسأل أولاً.',
          })}
        </p>
      </section>
      <section className="settings-page">
        <SettingsBody />
      </section>
    </>
  );
}
