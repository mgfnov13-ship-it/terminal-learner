import { Link } from 'react-router-dom';
import { PRIVACY_COPY } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function PrivacyPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('privacy'));
  const earlier = PRIVACY_COPY.sections.slice(0, -1);
  return (
    <section className="legal">
      <p className="kicker">{bi(PRIVACY_COPY.kicker)}</p>
      <h1>{bi(PRIVACY_COPY.title)}</h1>
      <p className="lede">{bi(PRIVACY_COPY.lede)}</p>

      {earlier.map(([heading, body]) => (
        <div key={heading.en}>
          <h2>{bi(heading)}</h2>
          <p>{bi(body)}</p>
        </div>
      ))}

      <h2>{bi(PRIVACY_COPY.sections[5][0])}</h2>
      <p>
        {bi({
          en: 'You can reset your learning progress from Settings at any time. For full account deletion, contact us — see the ',
          ar: 'يمكنك إعادة ضبط تقدّم التعلّم من الإعدادات في أي وقت. لحذف الحساب كاملاً راسلنا — انظر ',
        })}
        <Link to="/contact">{bi({ en: 'contact page', ar: 'صفحة التواصل' })}</Link>.
      </p>
    </section>
  );
}
