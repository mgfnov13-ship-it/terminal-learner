import { BarChart3, BookOpen, Home, Target, Trophy, Volume2, Wifi } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { missionById } from '../../data/missions';
import { FILES_TRACK, lessonNumber, trackLessons, unitNumber, unitOfLesson } from '../../data/tracks';
import { activeLesson } from '../../engine/tutorial';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { lessonTitle, missionField, missionTitle } from '../../lib/localizeContent';
import { useClock, useOS, useOSApi } from '../../hooks/useOS';

const NAV = [
  { to: '/app', labelKey: 'home' as const, Icon: Home, match: ['/app'], exact: true },
  { to: '/app/learn/files', labelKey: 'learn' as const, Icon: BookOpen, match: ['/app/learn', '/app/lab'] },
  { to: '/app/missions', labelKey: 'missions' as const, Icon: Target, match: ['/app/missions'] },
  { to: '/app/progress', labelKey: 'progress' as const, Icon: BarChart3, match: ['/app/progress'] },
  { to: '/app/achievements', labelKey: 'achievements' as const, Icon: Trophy, match: ['/app/achievements'] },
];

export function LabDock() {
  const { t, language, bi } = usePreferences();
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
  const time = now.toLocaleTimeString(language === 'ar' ? 'ar' : undefined, { hour: 'numeric', minute: '2-digit' });
  const date = now.toLocaleDateString(language === 'ar' ? 'ar' : undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <footer className="dock">
      <nav className="dock-nav" aria-label={t('labDock')}>
        {NAV.map((item) => {
          const active = item.exact
            ? item.match.includes(pathname)
            : item.match.some((m) => pathname.startsWith(m));
          return (
            <NavLink key={item.to} to={item.to} className={`dock-link${active ? ' is-on' : ''}`}>
              <item.Icon size={16} strokeWidth={1.7} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        className="dock-now"
        onClick={() => api.openLearningWorkspace()}
        title={bi({ en: 'Bring the lesson back into focus', ar: 'أعد الدرس إلى الواجهة' })}
      >
        <span className="dock-now-ico" aria-hidden>
          <Target size={16} strokeWidth={1.8} />
        </span>
        <span className="dock-now-text">
          <strong>
            {inMission
              ? missionTitle(mission?.id ?? '', language, mission?.title ?? '')
              : lessonTitle(lesson.id, language)}
          </strong>
          <span>
            {inMission
              ? `${t('mission')} · ${missionField(mission?.id ?? '', 'difficulty', language, mission?.difficulty ?? '')}`
              : `${t('unit')} ${unitNumber(unit?.id ?? '')} · ${t('lesson')} ${lessonNumber(lesson.id)} ${bi({ en: 'of', ar: 'من' })} ${total}`}
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
