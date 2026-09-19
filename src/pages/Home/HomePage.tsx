import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { FILES_TRACK, PLANNED_TRACKS, lessonNumber, trackLessons, unitNumber } from '../../data/tracks';
import { HOME_COPY, lessonsUnitsBuilt } from '../../data/pageCopy';
import { activeLesson, currentUnit, filesLessonProgress } from '../../engine/tutorial';
import { signInRedirectPath } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS } from '../../hooks/useOS';
import { lessonTitle, trackName, trackTagline, unitName } from '../../lib/localizeContent';

export function HomePage() {
  const { t, bi, language } = usePreferences();
  useEffect(() => {
    document.title = `${t('appName')} — ${bi(HOME_COPY.titleSuffix)}`;
  }, [bi, t]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress } = useOS();
  const lessons = trackLessons(FILES_TRACK);
  const files = filesLessonProgress(progress);
  const started = progress.onboardingComplete || files.done > 0;
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);
  const builtUnits = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;

  function goPrimary() {
    if (user) {
      navigate(started ? `/app/lab/files/${lesson.id}` : '/app/learn/files');
      return;
    }
    navigate(signInRedirectPath('/app/learn/files'));
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">{t('appName')}</p>
          <h1>
            {bi(HOME_COPY.heroLine1)}
            <br />
            {bi(HOME_COPY.heroLine2)}
          </h1>
          <p className="lede">{bi(HOME_COPY.lede)}</p>
          <div className="cta-row">
            <button type="button" className="btn-primary" onClick={goPrimary}>
              {user ? t('continueLesson') : t('startLearning')}
            </button>
            <Link className="btn-secondary" to="/tracks/files">
              {bi(HOME_COPY.seeFiles)}
            </Link>
          </div>
          <p className="hero-note">{bi(HOME_COPY.heroNote)}</p>
        </div>

        <div className="hero-proof">
          <div className="transcript" dir="ltr" lang="en" aria-label={bi(HOME_COPY.transcriptAria)}>
            <p className="transcript-label">{bi(HOME_COPY.transcriptLabel)}</p>
            <pre>
              <code>{`C:\\Users\\Student> mkdir Projects

C:\\Users\\Student> cd Projects

C:\\Users\\Student\\Projects> dir
 Directory of C:\\Users\\Student\\Projects
 0 File(s)

C:\\Users\\Student\\Projects> `}</code>
            </pre>
          </div>
          <aside className="proof-card">
            <p className="brief-label">{bi(HOME_COPY.briefLabel)}</p>
            <h2>{bi(HOME_COPY.proofTitle)}</h2>
            <p>
              <strong>{t('yourTurn')}</strong> {bi(HOME_COPY.proofBody)}
            </p>
            <p className="proof-card-note">{bi(HOME_COPY.proofNote)}</p>
          </aside>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(HOME_COPY.howIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(HOME_COPY.howTitle)}</h2>
          <ol className="stages">
            {HOME_COPY.stages.map((s) => (
              <li key={s.step}>
                <span className="stage-num">{s.step}</span>
                <div>
                  <h3>{bi(s.title)}</h3>
                  <p>{bi(s.body)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(HOME_COPY.tracksIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(HOME_COPY.tracksTitle)}</h2>
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
                  <span className="status-detail">
                    {bi(lessonsUnitsBuilt(lessons.length, builtUnits, FILES_TRACK.units.length))}
                  </span>
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
          <p className="table-note">{bi(HOME_COPY.plannedNote)}</p>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(HOME_COPY.whyIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(HOME_COPY.whyTitle)}</h2>
          <dl className="reasons">
            {HOME_COPY.reasons.map(([term, detail]) => (
              <div key={term.en}>
                <dt>{bi(term)}</dt>
                <dd>{bi(detail)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="closing">
        {user && started ? (
          <>
            <p className="kicker">{t('continueLesson')}</p>
            <h2>
              {t('unit')} {unitNumber(unit?.id ?? '')} · {unitName(unit?.id ?? '', language, unit?.name ?? '')}
            </h2>
            <p className="closing-line">
              {t('lesson')} {lessonNumber(lesson.id)} · {lessonTitle(lesson.id, language)} — {files.done} {t('of')}{' '}
              {files.total} {t('lessonsWord')} {t('complete')}.
            </p>
            <Link className="btn-chip" to={`/app/lab/files/${lesson.id}`}>
              {t('continue')} <DirArrow />
            </Link>
          </>
        ) : (
          <>
            <p className="kicker">{bi(HOME_COPY.ready)}</p>
            <h2>
              {bi(HOME_COPY.startUnit1)} · {unitName(FILES_TRACK.units[0].id, language, FILES_TRACK.units[0].name)}
            </h2>
            <p className="closing-line">{bi(HOME_COPY.firstLessonNote)}</p>
            <Link className="btn-chip" to="/tracks/files">
              {bi(HOME_COPY.seeFiles)} <DirArrow />
            </Link>
          </>
        )}
      </section>
    </>
  );
}
