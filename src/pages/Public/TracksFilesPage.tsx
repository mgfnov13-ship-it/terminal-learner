import { Link, useNavigate } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { FILES_TRACK, trackLessons } from '../../data/tracks';
import { TRACKS_FILES_COPY, publishedLessonsNote, startWithUnit } from '../../data/pageCopy';
import { signInRedirectPath } from '../../features/auth/redirect';
import { useAuth } from '../../features/auth/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { trackBlurb, trackName, unitName, unitSummary } from '../../lib/localizeContent';

export function TracksFilesPage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(trackName(FILES_TRACK.id, language));
  const { user } = useAuth();
  const navigate = useNavigate();
  const lessons = trackLessons(FILES_TRACK);
  const builtUnits = FILES_TRACK.units.filter((u) => u.lessonIds.length > 0).length;
  const startLabel = user ? bi(TRACKS_FILES_COPY.continue) : bi(TRACKS_FILES_COPY.start);

  function goStart() {
    if (user) {
      navigate('/app/learn/files');
      return;
    }
    navigate(signInRedirectPath('/app/learn/files'));
  }

  return (
    <>
      <section className="path-head">
        <p className="kicker">{bi(TRACKS_FILES_COPY.kicker)}</p>
        <h1>{trackName(FILES_TRACK.id, language)}</h1>
        <p className="lede">{trackBlurb(FILES_TRACK.id, language)}</p>
        <div className="cta-row">
          <button type="button" className="btn-primary" onClick={goStart}>
            {startLabel}
          </button>
        </div>
        <p className="hero-note">{bi(publishedLessonsNote(lessons.length, builtUnits, FILES_TRACK.units.length))}</p>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(TRACKS_FILES_COPY.whoIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(TRACKS_FILES_COPY.whoTitle)}</h2>
          <p>{bi(TRACKS_FILES_COPY.whoBody)}</p>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(TRACKS_FILES_COPY.skillsIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(TRACKS_FILES_COPY.skillsTitle)}</h2>
          <dl className="reasons">
            {TRACKS_FILES_COPY.skills.map((s) => (
              <div key={s.en}>
                <dt>{bi(s).split(' ').slice(0, 3).join(' ')}</dt>
                <dd>{bi(s)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(TRACKS_FILES_COPY.curriculumIndex)}</p>
        <div className="numbered-body">
          <h2>
            {builtUnits === FILES_TRACK.units.length
              ? bi({
                  en: `Eight units. All ${builtUnits} are published.`,
                  ar: `ثماني وحدات. كلها منشورة.`,
                })
              : bi({
                  en: `Eight units. ${builtUnits} published, ${FILES_TRACK.units.length - builtUnits} planned.`,
                  ar: `ثماني وحدات. ${builtUnits} منشورة، و${FILES_TRACK.units.length - builtUnits} مخططة.`,
                })}
          </h2>
          <ol className="units">
            {FILES_TRACK.units.map((u, i) => (
              <li key={u.id} className={u.lessonIds.length > 0 ? 'unit is-available' : 'unit is-planned'}>
                <div className="unit-head">
                  <p className="unit-index">
                    {t('unit')} {i + 1}
                  </p>
                  <h2>{unitName(u.id, language, u.name)}</h2>
                  <p className="unit-summary">{unitSummary(u.id, language, u.summary)}</p>
                  <p className="unit-meta">
                    <span className={`status${u.lessonIds.length > 0 ? ' is-open' : ''}`}>
                      {u.lessonIds.length > 0 ? t('available') : t('planned')}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="numbered">
        <p className="section-index">{bi(TRACKS_FILES_COPY.howIndex)}</p>
        <div className="numbered-body">
          <h2>{bi(TRACKS_FILES_COPY.howTitle)}</h2>
          <p>{bi(TRACKS_FILES_COPY.howBody)}</p>
        </div>
      </section>

      <section className="closing">
        <p className="kicker">{bi(TRACKS_FILES_COPY.ready)}</p>
        <h2>{bi(startWithUnit(unitName(FILES_TRACK.units[0].id, language, FILES_TRACK.units[0].name)))}</h2>
        <button type="button" className="btn-chip" onClick={goStart}>
          {startLabel} <DirArrow />
        </button>
      </section>

      <p className="table-note">
        <Link to="/tracks">{bi(TRACKS_FILES_COPY.allTracks)}</Link>
      </p>
    </>
  );
}
