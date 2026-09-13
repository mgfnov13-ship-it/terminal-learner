import { BarChart3, BookOpen, Home, Target, Trophy, Volume2, Wifi } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { missionById } from '../../data/missions';
import { FILES_TRACK, lessonNumber, trackLessons, unitNumber, unitOfLesson } from '../../data/tracks';
import { activeLesson } from '../../engine/tutorial';
import { useClock, useOS, useOSApi } from '../../hooks/useOS';

const NAV = [
  { to: '/', label: 'Home', Icon: Home, match: ['/'] },
  { to: '/learn/files', label: 'Learn', Icon: BookOpen, match: ['/learn', '/academy'] },
  { to: '/dashboard', label: 'Progress', Icon: BarChart3, match: ['/dashboard'] },
  { to: '/achievements', label: 'Achievements', Icon: Trophy, match: ['/achievements'] },
];

export function LabDock() {
  const { progress } = useOS();
  const api = useOSApi();
  const { pathname } = useLocation();
  const tick = useClock();
  const now = new Date(tick * 1000);
  const lesson = activeLesson(progress);
  const mission = missionById(progress.activeMissionId ?? undefined);
  const inMission = progress.academyTab === 'missions' && Boolean(mission);
  const unit = unitOfLesson(lesson.id);
  const total = trackLessons(FILES_TRACK).length;
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const date = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <footer className="dock">
      <nav className="dock-nav" aria-label="Terminal Space">
        {NAV.map((item) => {
          const active = item.match.some((m) => (m === '/' ? pathname === '/' : pathname.startsWith(m)));
          return (
            <NavLink key={item.to} to={item.to} className={`dock-link${active ? ' is-on' : ''}`}>
              <item.Icon size={16} strokeWidth={1.7} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        className="dock-now"
        onClick={() => api.openLearningWorkspace()}
        title="Bring the lesson back into focus"
      >
        <span className="dock-now-ico" aria-hidden>
          <Target size={16} strokeWidth={1.8} />
        </span>
        <span className="dock-now-text">
          <strong>{inMission ? mission?.title : lesson.title}</strong>
          <span>
            {inMission
              ? `Mission · ${mission?.difficulty}`
              : `Unit ${unitNumber(unit?.id ?? '')} · Lesson ${lessonNumber(lesson.id)} of ${total}`}
          </span>
        </span>
      </button>

      <div className="dock-tray">
        <span className="tray-ico" title="Network: simulated" aria-hidden>
          <Wifi size={15} strokeWidth={1.6} />
        </span>
        <span className="tray-ico" title="Volume: simulated" aria-hidden>
          <Volume2 size={15} strokeWidth={1.6} />
        </span>
        <time dateTime={now.toISOString()}>
          <strong>{time}</strong>
          <span>{date}</span>
        </time>
      </div>
    </footer>
  );
}
