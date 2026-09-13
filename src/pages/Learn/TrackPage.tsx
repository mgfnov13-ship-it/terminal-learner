import { Link, useParams } from 'react-router-dom';
import { trackById } from '../../data/tracks';
import { FilesPathPage } from './FilesPathPage';
import { NotFoundPage } from '../NotFound/NotFoundPage';

/** /learn/:trackId — the Files path, an honest "planned" page, or a 404. */
export function TrackPage() {
  const { trackId } = useParams();
  const track = trackById(trackId);

  if (!track) return <NotFoundPage title="No such track" body={`Terminal Space has no track called “${trackId}”.`} />;
  if (track.id === 'files') return <FilesPathPage />;

  return (
    <section className="planned">
      <p className="kicker">Planned track</p>
      <h1>{track.name} is not built yet</h1>
      <p className="lede">
        {track.tagline} There are no lessons behind this page, so rather than show you an empty path, here is the
        honest version: it does not exist yet.
      </p>
      <p>
        The Files track is finished and is the right place to start — most of what you learn there (paths, arguments,
        reading errors) is what makes the later tracks readable.
      </p>
      <div className="cta-row">
        <Link className="btn-primary" to="/app/learn/files">
          Go to the Files track
        </Link>
        <Link className="btn-secondary" to="/app">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
