import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { HELP_PUBLIC } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function PublicHelpPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('help'));
  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(HELP_PUBLIC.kicker)}</p>
        <h1>{bi(HELP_PUBLIC.title)}</h1>
      </section>

      <section className="numbered">
        <div className="numbered-body">
          <dl className="reasons">
            {HELP_PUBLIC.faq.map(([q, a]) => (
              <div key={q.en}>
                <dt>{bi(q)}</dt>
                <dd>{bi(a)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="path-foot">
        <p>{bi(HELP_PUBLIC.still)}</p>
        <Link className="text-link" to="/contact">
          {t('contactUs')} <DirArrow />
        </Link>
      </section>
    </>
  );
}
