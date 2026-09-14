import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { lessonById } from '../../data/curriculum';
import { FILES_PATH_COPY, completeUnitToUnlock, PROGRESS_COPY } from '../../data/pageCopy';
import { FILES_TRACK, lessonNumber } from '../../data/tracks';
import { filesCompletionLevel } from '../../engine/pathNodes';
import {
  activeLesson,
  currentUnit,
  filesLessonProgress,
  lessonState,
  unitProgress,
  unitState,
} from '../../engine/tutorial';
import { useOS } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { lessonSubtitle, lessonTitle, trackBlurb, trackName, unitName, unitSummary } from '../../lib/localizeContent';

export function FilesPathPage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(trackName(FILES_TRACK.id, language));
  const navigate = useNavigate();
  const { progress } = useOS();
  const files = filesLessonProgress(progress);
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);
  const level = filesCompletionLevel(progress);
  const currentRowRef = useRef<HTMLLIElement | null>(null);
  const [showReturnToCurrent, setShowReturnToCurrent] = useState(false);

  useEffect(() => {
    currentRowRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  useEffect(() => {
    const el = currentRowRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setShowReturnToCurrent(!entry.isIntersecting), {
      rootMargin: '-96px 0px -96px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Which built unit is actually blocking a locked one, so "Locked" never appears unexplained.
  function stateLabel(state: string): string {
    if (state === 'complete') return t('complete');
    if (state === 'current') return t('inProgress');
    if (state === 'available') return t('ready');
    if (state === 'locked') return t('locked');
    return t('planned');
  }

  function blockingUnitName(unitIndex: number): string | null {
    for (let i = unitIndex - 1; i >= 0; i -= 1) {
      const prior = FILES_TRACK.units[i];
      if (prior.lessonIds.length === 0) continue;
      if (unitState(prior, progress) !== 'complete') return unitName(prior.id, language, prior.name);
    }
    return null;
  }

  return (
    <>
      <section className="path-head">
        <p className="kicker">{t('track')}</p>
        <h1>{trackName(FILES_TRACK.id, language)}</h1>
        <p className="lede">{trackBlurb(FILES_TRACK.id, language)}</p>
        <div className="path-stats">
          <div
            className="meter"
            role="progressbar"
            aria-valuenow={files.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={bi(PROGRESS_COPY.completionAria)}
          >
            <span style={{ width: `${files.percent}%` }} />
          </div>
          <p>
            {files.percent}% {t('complete')} · {files.done} {t('of')} {files.total} {t('lessonsWord')} ·{' '}
            {bi(FILES_PATH_COPY.currentlyIn)} {FILES_TRACK.units.findIndex((u) => u.id === unit?.id) + 1},{' '}
            {unitName(unit?.id ?? '', language, unit?.name ?? '')}
          </p>
        </div>
        {level === 'foundations-complete' ? (
          <p className="foundations-note">{bi(FILES_PATH_COPY.foundations)}</p>
        ) : (
          <div className="cta-row">
            <Link className="btn-primary" to={`/app/lab/files/${lesson.id}`}>
              {files.done === 0 && progress.currentStepIndex === 0
                ? `${t('startLesson')} 1`
                : `${t('continueLesson')}: ${lessonTitle(lesson.id, language)}`}
            </Link>
          </div>
        )}
      </section>

      <ol className="units">
        {FILES_TRACK.units.map((u, i) => {
          const state = unitState(u, progress);
          const stats = unitProgress(u, progress);
          const blocker = state === 'locked' ? blockingUnitName(i) : null;
          return (
            <li key={u.id} className={`unit is-${state}`}>
              <div className="unit-head">
                  <p className="unit-index">
                    {t('unit')} {i + 1}
                  </p>
                <h2>{unitName(u.id, language, u.name)}</h2>
                <p className="unit-summary">{unitSummary(u.id, language, u.summary)}</p>
                <p className="unit-meta">
                  <span className={`status${state === 'complete' || state === 'current' ? ' is-open' : ''}`}>
                    {stateLabel(state)}
                  </span>
                  {u.lessonIds.length > 0 && (
                    <span className="status-detail">
                      {stats.done} / {stats.total} {t('lessonsWord')}
                    </span>
                  )}
                </p>
                {blocker && <p className="unit-lock-reason">{bi(completeUnitToUnlock(blocker))}</p>}
              </div>

              {u.lessonIds.length === 0 ? (
                <p className="unit-empty">{bi(FILES_PATH_COPY.plannedEmpty)}</p>
              ) : (
                <ul className="lesson-rows">
                  {u.lessonIds.map((id) => {
                    const l = lessonById(id);
                    if (!l) return null;
                    const ls = lessonState(id, progress);
                    const open = ls !== 'locked';
                    return (
                      <li key={id} className={`lesson-row is-${ls}`} ref={ls === 'current' ? currentRowRef : undefined}>
                        <button
                          type="button"
                          disabled={!open}
                          aria-current={ls === 'current' ? 'step' : undefined}
                          onClick={() => navigate(`/app/lab/files/${id}`)}
                        >
                          <span className="lesson-num">{lessonNumber(id)}</span>
                          <span className="lesson-text">
                            <strong>{lessonTitle(id, language)}</strong>
                            <span>{lessonSubtitle(id, language)}</span>
                          </span>
                          <span className="lesson-state">
                            {ls === 'locked' ? bi({ en: 'Finish the previous lesson', ar: 'أنهِ الدرس السابق' }) : stateLabel(ls)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <section className="path-foot">
        <p>
          {bi({
            en: 'Finished the lessons you need? Missions apply them to a messy scenario with no step-by-step guidance.',
            ar: 'أنهيت الدروس التي تحتاجها؟ المهام تطبّقها على سيناريو فوضوي بلا توجيه خطوة بخطوة.',
          })}
        </p>
        <Link className="text-link" to="/app/missions">
          {bi({ en: 'Practical missions', ar: 'مهام عملية' })} <DirArrow />
        </Link>
      </section>

      {showReturnToCurrent && level !== 'foundations-complete' && (
        <button
          type="button"
          className="return-to-current"
          onClick={() => currentRowRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })}
        >
          {bi({ en: 'Return to current lesson', ar: 'العودة إلى الدرس الحالي' })}
        </button>
      )}
    </>
  );
}
