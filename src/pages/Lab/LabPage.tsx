import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import App from '../../App';
import { lessonById } from '../../data/curriculum';
import { missionById } from '../../data/missions';
import { useOS, useOSApi } from '../../hooks/useOS';

/** Full-screen lab for one lesson. The URL is the source of truth for which lesson runs. */
export function LessonLabPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? lessonById(lessonId) : undefined;
  const api = useOSApi();

  useEffect(() => {
    if (lesson) api.enterLesson(lesson.id);
  }, [lesson, api]);

  if (!lesson) {
    return (
      <LabRouteError
        title="That lesson does not exist"
        body={`No lesson is registered as “${lessonId}”. It may have been renamed, or the link may be mistyped.`}
      />
    );
  }
  return <App />;
}

/** Full-screen lab for one mission scenario. */
export function MissionLabPage() {
  const { missionId } = useParams();
  const mission = missionId ? missionById(missionId) : undefined;
  const api = useOSApi();

  useEffect(() => {
    if (mission) api.enterMission(mission.id);
  }, [mission, api]);

  if (!mission) {
    return (
      <LabRouteError
        title="That mission does not exist"
        body={`No mission is registered as “${missionId}”.`}
        backTo="/missions"
        backLabel="All missions"
      />
    );
  }
  return <App />;
}

/** /academy with no lesson: send the learner to whatever they were last working on. */
export function AcademyEntry() {
  const { progress } = useOS();
  return <Navigate to={`/academy/files/${progress.currentLessonId}`} replace />;
}

function LabRouteError({
  title,
  body,
  backTo = '/learn/files',
  backLabel = 'Files path',
}: {
  title: string;
  body: string;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <div className="route-error">
      <div>
        <p className="kicker">Broken link</p>
        <h1>{title}</h1>
        <p>{body}</p>
        <div className="cta-row">
          <Link className="btn-primary" to={backTo}>
            {backLabel}
          </Link>
          <Link className="btn-secondary" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
