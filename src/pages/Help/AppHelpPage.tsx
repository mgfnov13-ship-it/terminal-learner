import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { HELP_APP } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function AppHelpPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('help'));
  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(HELP_APP.kicker)}</p>
        <h1>{bi(HELP_APP.title)}</h1>
        <p className="lede">{bi(HELP_APP.lede)}</p>
      </section>

      <section className="numbered">
        <div className="numbered-body">
          <dl className="reasons">
            {HELP_APP.faq.map(([q, a]) => (
              <div key={q.en}>
                <dt>{bi(q)}</dt>
                <dd>{bi(a)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="path-foot">
        <p>{bi(HELP_APP.more)}</p>
        <Link className="text-link" to="/contact">
          {t('contactUs')} <DirArrow />
        </Link>
      </section>
    </>
  );
}
