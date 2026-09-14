import { Link } from 'react-router-dom';
import { FILES_TRACK, PLANNED_TRACKS } from '../../data/tracks';
import { TRACKS_COPY } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { trackName, trackTagline } from '../../lib/localizeContent';

export function TracksPage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(t('tracks'));
  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(TRACKS_COPY.kicker)}</p>
        <h1>{bi(TRACKS_COPY.title)}</h1>
        <p className="lede">{bi(TRACKS_COPY.lede)}</p>
      </section>

      <section className="numbered">
        <div className="numbered-body">
          <table className="spec">
            <thead>
              <tr>
                <th scope="col">{t('track')}</th>
                <th scope="col">{t('covers')}</th>
                <th scope="col">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <Link to="/tracks/files">{trackName(FILES_TRACK.id, language)}</Link>
                </th>
                <td>{trackTagline(FILES_TRACK.id, language)}</td>
                <td>
                  <span className="status is-open">{t('available')}</span>
                </td>
              </tr>
              {PLANNED_TRACKS.map((track) => (
                <tr key={track.id} className="is-planned">
                  <th scope="row">{trackName(track.id, language)}</th>
                  <td>{trackTagline(track.id, language)}</td>
                  <td>
                    <span className="status">{t('planned')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="table-note">{bi(TRACKS_COPY.plannedNote)}</p>
        </div>
      </section>
    </>
  );
}
