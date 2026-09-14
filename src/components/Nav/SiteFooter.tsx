import { Link } from 'react-router-dom';
import { MISSIONS } from '../../data/missions';
import { FILES_TRACK, trackLessons } from '../../data/tracks';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function SiteFooter() {
  const { t, bi } = usePreferences();
  const lessons = trackLessons(FILES_TRACK).length;
  const units = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;
  const planned = FILES_TRACK.units.length - units;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        {bi({
          en: `Terminal Space — a browser lab for learning the command line. One track is built: Files, ${lessons} lessons across ${units} units${planned ? `, ${planned} further units planned` : ''}. ${MISSIONS.length} practical missions.`,
          ar: `تيرمنال سبيس — مختبر في المتصفح لتعلّم سطر الأوامر. مسار واحد مبني: الملفات، ${lessons} درساً عبر ${units} وحدات${planned ? `، و${planned} وحدات أخرى مخططة` : ''}. ${MISSIONS.length} مهام عملية.`,
        })}
      </p>
      <p>
        {bi({
          en: 'Every command runs against a simulated Windows-style filesystem inside this tab. Nothing touches your real machine. Progress is saved to your account when you sign in, or to this browser only while you are not.',
          ar: 'كل أمر يعمل على نظام ملفات محاكى بأسلوب Windows داخل هذا التبويب. لا شيء يمس جهازك الحقيقي. يُحفظ التقدّم في حسابك عند تسجيل الدخول، أو في هذا المتصفح فقط وأنت غير مسجّل.',
        })}
      </p>
      <p>
        <Link to="/tracks">{t('tracks')}</Link> · <Link to="/how-it-works">{t('howItWorks')}</Link> ·{' '}
        <Link to="/about">{t('about')}</Link> · <Link to="/help">{t('help')}</Link> · <Link to="/contact">{t('contact')}</Link>
      </p>
      <p className="site-footer-copyright">
        © {year} {t('appName')}
      </p>
    </footer>
  );
}
