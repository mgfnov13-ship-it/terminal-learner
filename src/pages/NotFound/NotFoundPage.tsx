import { Link, useLocation } from 'react-router-dom';

export function NotFoundPage({ title, body }: { title?: string; body?: string } = {}) {
  const { pathname } = useLocation();
  return (
    <section className="planned">
      <p className="kicker">404</p>
      <h1>{title ?? 'That page does not exist'}</h1>
      <p className="lede">{body ?? `Nothing is routed at ${pathname}.`}</p>
      <div className="cta-row">
        <Link className="btn-primary" to="/dashboard">
          Dashboard
        </Link>
        <Link className="btn-secondary" to="/learn/files">
          Files path
        </Link>
      </div>
    </section>
  );
}
