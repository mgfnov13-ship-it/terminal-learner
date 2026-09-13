import { Link } from 'react-router-dom';
import { MISSIONS } from '../../data/missions';
import { FILES_TRACK, trackLessons } from '../../data/tracks';

/** Ft4 Dense colophon — one mono block, log-style, no four-column sitemap. */
export function SiteFooter() {
  const lessons = trackLessons(FILES_TRACK).length;
  const units = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;
  const planned = FILES_TRACK.units.length - units;

  return (
    <footer className="site-footer">
      <p>
        Terminal Space — a browser lab for learning the command line. One track is built:{' '}
        <Link to="/learn/files">Files</Link>, {lessons} lessons across {units} units, {planned} further units written
        but not yet built. {MISSIONS.length} practical missions.
      </p>
      <p>
        Every command runs against a simulated Windows-style filesystem inside this tab. Nothing touches your real
        machine, and no account is required. Progress is saved in this browser's local storage only — clearing site
        data clears your XP.
      </p>
      <p>
        <Link to="/settings">settings</Link> · <Link to="/achievements">achievements</Link> · built with Vite, React,
        and no analytics.
      </p>
    </footer>
  );
}
