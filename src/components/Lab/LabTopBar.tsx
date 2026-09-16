import { useEffect, useRef, useState } from 'react';
import { AccessibilityPanel } from '../A11y/AccessibilityPanel';
import { LogOut, Search, Settings, SquareTerminal, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { levelFromXp, levelProgress, nextThreshold } from '../../data/player';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { lessonSubtitle, lessonTitle, trackName } from '../../lib/localizeContent';
import { FILES_TRACK, lessonNumber, trackLessons, unitNumber } from '../../data/tracks';
import { activeLesson, currentUnit } from '../../engine/tutorial';
import { useOS, useOSApi } from '../../hooks/useOS';
import { LAB_COMPACT_QUERY, useMedia } from '../../hooks/useMedia';

export function LabTopBar() {
  const { progress, windows, focusedId } = useOS();
  const api = useOSApi();
  const { t, bi, language } = usePreferences();
  const compact = useMedia(LAB_COMPACT_QUERY);
  const navigate = useNavigate();
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);
  const level = levelFromXp(progress.xp);
  const next = nextThreshold(progress.xp);
  const pct = Math.round(levelProgress(progress.xp) * 100);
  const focusedApp = windows.find((w) => w.id === focusedId)?.appId;

  return (
    <header className="labbar">
      <Link to="/app" className="labbar-brand" aria-label={bi({ en: 'Terminal Space dashboard', ar: 'لوحة تيرمنال سبيس' })}>
        <span className="labbar-logo" aria-hidden>
          <SquareTerminal size={18} strokeWidth={2} />
        </span>
        <span className="labbar-word">{t('appName')}</span>
      </Link>

      {compact ? (
        <div className="lab-panes" role="tablist" aria-label={t('labPanes')}>
          <button
            type="button"
            role="tab"
            aria-selected={focusedApp === 'terminal'}
            className={focusedApp === 'terminal' ? 'is-on' : undefined}
            onClick={() => {
              api.openApp('terminal');
              api.focusTerminal();
            }}
          >
            {t('terminal')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={focusedApp === 'academy'}
            className={focusedApp === 'academy' ? 'is-on' : undefined}
            onClick={() => api.openApp('academy')}
          >
            {t('guide')}
          </button>
        </div>
      ) : null}

      <nav className="crumbs" aria-label={bi({ en: 'Breadcrumb', ar: 'مسار التنقل' })}>
        <Link to="/app/learn/files">{t('learn')}</Link>
        <span aria-hidden>/</span>
        <Link to="/app/learn/files">{trackName(FILES_TRACK.id, language)}</Link>
        <span aria-hidden>/</span>
        <Link to="/app/learn/files">
          {t('unit')} {unitNumber(unit?.id ?? '')}
        </Link>
        <span aria-hidden>/</span>
        <span className="crumb-now" aria-current="page">
          {lessonTitle(lesson.id, language)}
        </span>
      </nav>

      <LessonSearch />

      <div className="labbar-player">
        <span className="labbar-avatar-ico" aria-hidden>
          <UserRound size={16} strokeWidth={1.6} />
        </span>
        <span className="labbar-player-text">
          <span className="labbar-player-label">{t('player')}</span>
          <strong>
            {t('level')} {level}
          </strong>
        </span>
        <span className="labbar-xp">
          <span>{next ? `${(next - progress.xp).toLocaleString()} XP ${bi({ en: 'to level', ar: 'حتى المستوى' })} ${level + 1}` : `${progress.xp} XP`}</span>
          <span
            className="labbar-xp-bar"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('xpTowardLevel')}
          >
            <span style={{ width: `${pct}%` }} />
          </span>
        </span>
      </div>

      <AccessibilityPanel iconOnly />
      <button type="button" className="labbar-icon" aria-label={t('settings')} onClick={() => api.openApp('settings')}>
        <Settings size={18} strokeWidth={1.6} />
      </button>

      <button
        type="button"
        className="labbar-icon labbar-exit"
        aria-label={t('exitLesson')}
        title={t('exitLesson')}
        onClick={() => navigate('/app')}
      >
        <LogOut size={18} strokeWidth={1.6} />
      </button>
    </header>
  );
}

/** Type or press / to jump to any lesson in the track. */
function LessonSearch() {
  const navigate = useNavigate();
  const { t, language } = usePreferences();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = 'lesson-search-list';
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
    ? lessons.filter((l) => `${lessonTitle(l.id, language)} ${lessonSubtitle(l.id, language)}`.toLowerCase().includes(q)).slice(0, 6)
    : [];

  const go = (id: string) => {
    setQuery('');
    setOpen(false);
    input.current?.blur();
    navigate(`/app/lab/files/${id}`);
  };

  const activeId = hits[active] ? `lesson-opt-${hits[active].id}` : undefined;

  return (
    <div className="labsearch">
      <span className="labsearch-ico" aria-hidden>
        <Search size={15} strokeWidth={1.6} />
      </span>
      <input
        ref={input}
        type="search"
        role="combobox"
        value={query}
        placeholder={t('search')}
        aria-label={t('search')}
        aria-expanded={open && q.length > 0}
        aria-controls={listId}
        aria-activedescendant={open ? activeId : undefined}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && hits.length) {
            e.preventDefault();
            setActive((i) => Math.min(hits.length - 1, i + 1));
          } else if (e.key === 'ArrowUp' && hits.length) {
            e.preventDefault();
            setActive((i) => Math.max(0, i - 1));
          } else if (e.key === 'Enter' && hits[active]) {
            e.preventDefault();
            go(hits[active].id);
          } else if (e.key === 'Escape') {
            setQuery('');
            input.current?.blur();
          }
        }}
      />
      <kbd aria-hidden>/</kbd>
      {open && q.length > 0 && (
        <ul className="labsearch-results" id={listId} role="listbox" aria-label={t('search')}>
          {hits.length === 0 ? (
            <li className="labsearch-empty" role="option" aria-disabled="true">
              {query}
            </li>
          ) : (
            hits.map((l, i) => (
              <li key={l.id} id={`lesson-opt-${l.id}`} role="option" aria-selected={i === active}>
                <button type="button" onMouseDown={() => go(l.id)}>
                  <span className="labsearch-num">{lessonNumber(l.id)}</span>
                  <span>
                    <strong>{lessonTitle(l.id, language)}</strong>
                    <span>{lessonSubtitle(l.id, language)}</span>
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
