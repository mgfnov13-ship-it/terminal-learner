import { Link, useNavigate, useParams } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { missingSkillsFor, missionById } from '../../data/missions';
import { trackLessons } from '../../data/tracks';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import { lessonTitle, missionField, missionTitle } from '../../lib/localizeContent';
import { NotFoundPage } from '../NotFound/NotFoundPage';

export function MissionDetailPage() {
  const { t, bi, language } = usePreferences();
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { progress } = useOS();
  const mission = missionById(missionId);
  usePageTitle(mission ? missionTitle(mission.id, language, mission.title) : t('mission'));

  if (!mission) {
    return (
      <NotFoundPage
        title={bi({ en: 'That mission does not exist', ar: 'هذه المهمة غير موجودة' })}
        body={bi({
          en: `No mission is registered as “${missionId}”.`,
          ar: `لا توجد مهمة مسجّلة باسم “${missionId}”.`,
        })}
      />
    );
  }

  const complete = progress.completedMissionIds.includes(mission.id);
  const missing = missingSkillsFor(mission, progress).map((title) => {
    const match = trackLessons().find((l) => l.title === title);
    return match ? lessonTitle(match.id, language) : title;
  });
  const locked = missingSkillsFor(mission, progress).length > 0;

  return (
    <section className="mission-detail">
      <p className="kicker">{t('mission')}</p>
      <h1>{missionTitle(mission.id, language, mission.title)}</h1>
      <p className="chip-row">
        <span className="chip">{missionField(mission.id, 'difficulty', language, mission.difficulty)}</span>
        {mission.skills.map((s) => (
          <span key={s} className="chip is-mono">
            {s}
          </span>
        ))}
      </p>
      <p className="lede">{missionField(mission.id, 'scenario', language, mission.scenario)}</p>

      <div className="panel">
        <p className="section-index">{t('briefing')}</p>
        <p>{missionField(mission.id, 'briefing', language, mission.briefing)}</p>
        <p className="objective">
          <strong>{t('objective')}.</strong> {missionField(mission.id, 'objective', language, mission.objective)}
        </p>
        <p className="reward">{mission.xp} XP</p>
      </div>

      {complete && <p className="status is-open">{t('complete')}</p>}

      {locked ? (
        <div className="panel">
          <p className="lock-reason">
            {bi({ en: 'Needs first:', ar: 'يحتاج أولاً:' })} <strong>{missing.join(', ')}</strong>
          </p>
          <Link className="text-link" to="/app/learn/files">
            {bi({ en: 'Go to those lessons', ar: 'اذهب إلى تلك الدروس' })} <DirArrow />
          </Link>
        </div>
      ) : (
        <div className="cta-row">
          <button type="button" className="btn-primary" onClick={() => navigate(`/app/lab/mission/${mission.id}`)}>
            {complete ? t('replayMission') : t('startMission')}
          </button>
          <Link className="btn-secondary" to="/app/missions">
            {t('allMissions')}
          </Link>
        </div>
      )}
    </section>
  );
}
