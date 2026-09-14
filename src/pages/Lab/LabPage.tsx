import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import App from '../../App';
import { lessonById } from '../../data/curriculum';
import { missionById } from '../../data/missions';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS, useOSApi } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import { lessonTitle, missionTitle } from '../../lib/localizeContent';

/** Full-screen lab for one lesson. The URL is the source of truth for which lesson runs. */
export function LessonLabPage() {
  const { lessonId } = useParams();
  const { bi, language } = usePreferences();
  const lesson = lessonId ? lessonById(lessonId) : undefined;
  const api = useOSApi();
  usePageTitle(lesson ? lessonTitle(lesson.id, language) : undefined);

  useEffect(() => {
    if (lesson) api.enterLesson(lesson.id);
  }, [lesson, api]);

  if (!lesson) {
    return (
      <LabRouteError
        title={bi({ en: 'That lesson does not exist', ar: 'هذا الدرس غير موجود' })}
        body={bi({
          en: `No lesson is registered as “${lessonId}”. It may have been renamed, or the link may be mistyped.`,
          ar: `لا يوجد درس مسجّل باسم «${lessonId}». ربما أُعيدت تسميته، أو الرابط مكتوب خطأ.`,
        })}
      />
    );
  }
  return <App />;
}

/** Full-screen lab for one mission scenario. */
export function MissionLabPage() {
  const { missionId } = useParams();
  const { bi, language, t } = usePreferences();
  const mission = missionId ? missionById(missionId) : undefined;
  const api = useOSApi();
  usePageTitle(mission ? missionTitle(mission.id, language, mission.title) : undefined);

  useEffect(() => {
    if (mission) api.enterMission(mission.id);
  }, [mission, api]);

  if (!mission) {
    return (
      <LabRouteError
        title={bi({ en: 'That mission does not exist', ar: 'هذه المهمة غير موجودة' })}
        body={bi({
          en: `No mission is registered as “${missionId}”.`,
          ar: `لا توجد مهمة مسجّلة باسم «${missionId}».`,
        })}
        backTo="/app/missions"
        backLabel={t('allMissions')}
      />
    );
  }
  return <App />;
}

/** /app/lab with no lesson: send the learner to whatever they were last working on. */
export function AcademyEntry() {
  const { progress } = useOS();
  return <Navigate to={`/app/lab/files/${progress.currentLessonId}`} replace />;
}

function LabRouteError({
  title,
  body,
  backTo = '/app/learn/files',
  backLabel,
}: {
  title: string;
  body: string;
  backTo?: string;
  backLabel?: string;
}) {
  const { t, bi } = usePreferences();
  return (
    <div className="route-error">
      <div>
        <p className="kicker">{bi({ en: 'Broken link', ar: 'رابط غير صالح' })}</p>
        <h1>{title}</h1>
        <p>{body}</p>
        <div className="cta-row">
          <Link className="btn-primary" to={backTo}>
            {backLabel ?? bi({ en: 'Files path', ar: 'مسار الملفات' })}
          </Link>
          <Link className="btn-secondary" to="/app">
            {t('dashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
}
