import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { ABOUT_COPY } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function AboutPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('about'));
  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(ABOUT_COPY.kicker)}</p>
        <h1>{bi(ABOUT_COPY.title)}</h1>
        <p className="lede">{bi(ABOUT_COPY.lede)}</p>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(ABOUT_COPY.philIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(ABOUT_COPY.philTitle)}</h2>
          <p>{bi(ABOUT_COPY.philBody)}</p>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(ABOUT_COPY.notIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(ABOUT_COPY.notTitle)}</h2>
          <p>{bi(ABOUT_COPY.notBody)}</p>
        </div>
      </section>

      <section className="closing">
        <p className="kicker">{bi(ABOUT_COPY.ready)}</p>
        <h2>{bi(ABOUT_COPY.startFiles)}</h2>
        <Link className="btn-chip" to="/tracks/files">
          {bi(ABOUT_COPY.seeFiles)} <DirArrow />
        </Link>
      </section>
    </>
  );
}
