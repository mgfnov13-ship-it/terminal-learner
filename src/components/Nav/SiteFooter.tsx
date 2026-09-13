import { Link } from 'react-router-dom';
import { MISSIONS } from '../../data/missions';
import { FILES_TRACK, trackLessons } from '../../data/tracks';

/** Ft4 Dense colophon — one mono block, log-style, no four-column sitemap. */
export function SiteFooter() {
  const lessons = trackLessons(FILES_TRACK).length;
  const units = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;
  const planned = FILES_TRACK.units.length - units;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        Terminal Space — a browser lab for learning the command line. One track is built:{' '}
        <Link to="/tracks/files">Files</Link>, {lessons} lessons across {units} units, {planned} further units written
        but not yet built. {MISSIONS.length} practical missions.
      </p>
      <p>
        Every command runs against a simulated Windows-style filesystem inside this tab. Nothing touches your real
        machine. Progress is saved to your account when you sign in, or to this browser only while you're not.
      </p>
      <p>
        <Link to="/tracks">tracks</Link> · <Link to="/how-it-works">how it works</Link> · <Link to="/about">about</Link>{' '}
        · <Link to="/help">help</Link> · <Link to="/contact">contact</Link> · <Link to="/privacy">privacy</Link> ·{' '}
        <Link to="/terms">terms</Link>
      </p>
      <p className="site-footer-copyright">
        © {year} Terminal Space. Built with Vite, React, and no analytics.
      </p>
    </footer>
  );
}
