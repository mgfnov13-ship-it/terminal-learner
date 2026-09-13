import { Link } from 'react-router-dom';
import { FILES_TRACK, PLANNED_TRACKS } from '../../data/tracks';

export function TracksPage() {
  return (
    <>
      <section className="path-head">
        <p className="kicker">Tracks</p>
        <h1>One track is built. The rest are honest plans.</h1>
        <p className="lede">
          Terminal Space is built one finished track at a time, not a wide list of half-written ones.
        </p>
      </section>

      <section className="numbered">
        <div className="numbered-body">
          <table className="spec">
            <thead>
              <tr>
                <th scope="col">Track</th>
                <th scope="col">Covers</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <Link to="/tracks/files">{FILES_TRACK.name}</Link>
                </th>
                <td>{FILES_TRACK.tagline}</td>
                <td>
                  <span className="status is-open">Available</span>
                </td>
              </tr>
              {PLANNED_TRACKS.map((t) => (
                <tr key={t.id} className="is-planned">
                  <th scope="row">{t.name}</th>
                  <td>{t.tagline}</td>
                  <td>
                    <span className="status">Planned</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="table-note">Planned tracks are not clickable, because there is nothing behind them yet.</p>
        </div>
      </section>
    </>
  );
}
