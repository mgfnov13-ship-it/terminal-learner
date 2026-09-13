import { useEffect, useRef, useState } from 'react';
import { Search, Settings, SquareTerminal, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { levelFromXp, levelProgress, nextThreshold } from '../../data/player';
import { FILES_TRACK, lessonNumber, trackLessons, unitNumber } from '../../data/tracks';
import { activeLesson, currentUnit } from '../../engine/tutorial';
import { useOS, useOSApi } from '../../hooks/useOS';

export function LabTopBar() {
  const { progress } = useOS();
  const api = useOSApi();
  const navigate = useNavigate();
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);
  const level = levelFromXp(progress.xp);
  const next = nextThreshold(progress.xp);
  const pct = Math.round(levelProgress(progress.xp) * 100);

  return (
    <header className="labbar">
      <Link to="/" className="labbar-brand" aria-label="Terminal Space home">
        <span className="labbar-logo" aria-hidden>
          <SquareTerminal size={18} strokeWidth={2} />
        </span>
        <span className="labbar-word">Terminal Space</span>
      </Link>

      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn/files">Learn</Link>
        <span aria-hidden>/</span>
        <Link to="/learn/files">{FILES_TRACK.name}</Link>
        <span aria-hidden>/</span>
        <Link to="/learn/files">Unit {unitNumber(unit?.id ?? '')}</Link>
        <span aria-hidden>/</span>
        <span className="crumb-now" aria-current="page">
          {lesson.title}
        </span>
      </nav>

      <LessonSearch />

      <div className="labbar-player">
        <span className="labbar-avatar-ico" aria-hidden>
          <UserRound size={16} strokeWidth={1.6} />
        </span>
        <span className="labbar-player-text">
          <span className="labbar-player-label">Player</span>
          <strong>Level {level}</strong>
        </span>
        <span className="labbar-xp">
          <span>{next ? `${(next - progress.xp).toLocaleString()} XP to level ${level + 1}` : `${progress.xp} XP`}</span>
          <span
            className="labbar-xp-bar"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="XP toward next player level"
          >
            <span style={{ width: `${pct}%` }} />
          </span>
        </span>
      </div>

      <button type="button" className="labbar-icon" aria-label="Settings" onClick={() => api.openApp('settings')}>
        <Settings size={18} strokeWidth={1.6} />
      </button>

      <button
        type="button"
        className="labbar-avatar"
        aria-label="Signed in as Student — open dashboard"
        onClick={() => navigate('/dashboard')}
      >
        ST
      </button>
    </header>
  );
}

/** Type or press / to jump to any lesson in the track. */
function LessonSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const lessons = trackLessons(FILES_TRACK);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const hits = q
    ? lessons.filter((l) => `${l.title} ${l.subtitle}`.toLowerCase().includes(q)).slice(0, 6)
    : [];

  const go = (id: string) => {
    setQuery('');
    setOpen(false);
    input.current?.blur();
    navigate(`/academy/files/${id}`);
  };

  return (
    <div className="labsearch">
      <span className="labsearch-ico" aria-hidden>
        <Search size={15} strokeWidth={1.6} />
      </span>
      <input
        ref={input}
        type="search"
        value={query}
        placeholder="Search lessons..."
        aria-label="Search lessons"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && hits[0]) go(hits[0].id);
          if (e.key === 'Escape') {
            setQuery('');
            input.current?.blur();
          }
        }}
      />
      <kbd aria-hidden>/</kbd>
      {open && q.length > 0 && (
        <ul className="labsearch-results" role="listbox" aria-label="Lesson results">
          {hits.length === 0 ? (
            <li className="labsearch-empty">No lesson matches “{query}”.</li>
          ) : (
            hits.map((l) => (
              <li key={l.id}>
                <button type="button" onMouseDown={() => go(l.id)}>
                  <span className="labsearch-num">{lessonNumber(l.id)}</span>
                  <span>
                    <strong>{l.title}</strong>
                    <span>{l.subtitle}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
