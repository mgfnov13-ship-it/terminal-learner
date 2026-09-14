import { Link, useParams } from 'react-router-dom';
import { PLANNED_TRACK_COPY, NOT_FOUND_COPY, noTrackBody, plannedTrackTitle } from '../../data/pageCopy';
import { trackById } from '../../data/tracks';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { trackName, trackTagline } from '../../lib/localizeContent';
import { FilesPathPage } from './FilesPathPage';
import { NotFoundPage } from '../NotFound/NotFoundPage';

/** /learn/:trackId — the Files path, an honest "planned" page, or a 404. */
export function TrackPage() {
  const { bi, language } = usePreferences();
  const { trackId } = useParams();
  const track = trackById(trackId);
  const localizedName = track ? trackName(track.id, language) : undefined;
  usePageTitle(track && track.id !== 'files' ? localizedName : undefined);

  if (!track) {
    return <NotFoundPage title={bi(NOT_FOUND_COPY.noTrack)} body={bi(noTrackBody(trackId ?? ''))} />;
  }
  if (track.id === 'files') return <FilesPathPage />;

  return (
    <section className="planned">
      <p className="kicker">{bi(PLANNED_TRACK_COPY.kicker)}</p>
      <h1>{bi(plannedTrackTitle(localizedName ?? track.name))}</h1>
      <p className="lede">
        {trackTagline(track.id, language)} {bi(PLANNED_TRACK_COPY.honest)}
      </p>
      <p>{bi(PLANNED_TRACK_COPY.filesStart)}</p>
      <div className="cta-row">
        <Link className="btn-primary" to="/app/learn/files">
          {bi(PLANNED_TRACK_COPY.goFiles)}
        </Link>
        <Link className="btn-secondary" to="/app">
          {bi(PLANNED_TRACK_COPY.backDash)}
        </Link>
      </div>
    </section>
  );
}
