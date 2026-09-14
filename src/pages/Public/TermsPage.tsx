import { TERMS_COPY } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function TermsPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('terms'));
  return (
    <section className="legal">
      <p className="kicker">{bi(TERMS_COPY.kicker)}</p>
      <h1>{bi(TERMS_COPY.title)}</h1>
      <p className="lede">{bi(TERMS_COPY.lede)}</p>
      {TERMS_COPY.sections.map(([heading, body]) => (
        <div key={heading.en}>
          <h2>{bi(heading)}</h2>
          <p>{bi(body)}</p>
        </div>
      ))}
    </section>
  );
}
