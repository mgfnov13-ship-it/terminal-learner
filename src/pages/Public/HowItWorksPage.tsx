import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { HOW_COPY } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function HowItWorksPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('howItWorks'));
  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(HOW_COPY.kicker)}</p>
        <h1>{bi(HOW_COPY.title)}</h1>
        <p className="lede">{bi(HOW_COPY.lede)}</p>
      </section>

      <section className="numbered">
        <div className="numbered-body">
          <ol className="stages">
            {HOW_COPY.stages.map((s) => (
              <li key={s.step}>
                <span className="stage-num">{s.step}</span>
                <div>
                  <h3>{bi(s.title)}</h3>
                  <p>{bi(s.body)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(HOW_COPY.whyIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(HOW_COPY.whyTitle)}</h2>
          <dl className="reasons">
            {HOW_COPY.difference.map(([term, detail]) => (
              <div key={term.en}>
                <dt>{bi(term)}</dt>
                <dd>{bi(detail)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="closing">
        <p className="kicker">{bi(HOW_COPY.seeKicker)}</p>
        <h2>{bi(HOW_COPY.seeTitle)}</h2>
        <Link className="btn-chip" to="/demo">
          {bi(HOW_COPY.tryDemo)} <DirArrow />
        </Link>
      </section>
    </>
  );
}
