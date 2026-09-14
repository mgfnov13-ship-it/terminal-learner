import { Link, useLocation } from 'react-router-dom';
import { NOT_FOUND_COPY, nothingRouted } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function NotFoundPage({ title, body }: { title?: string; body?: string } = {}) {
  const { t, bi } = usePreferences();
  const { pathname } = useLocation();
  usePageTitle(title ?? bi(NOT_FOUND_COPY.tab));
  return (
    <section className="planned">
      <p className="kicker">404</p>
      <h1>{title ?? bi(NOT_FOUND_COPY.title)}</h1>
      <p className="lede">{body ?? bi(nothingRouted(pathname))}</p>
      <div className="cta-row">
        <Link className="btn-primary" to="/">
          {t('home')}
        </Link>
        <Link className="btn-secondary" to="/app">
          {t('dashboard')}
        </Link>
      </div>
    </section>
  );
}
