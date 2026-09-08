import {
  BatteryMedium,
  Folder,
  GraduationCap,
  HelpCircle,
  Search,
  Settings,
  TerminalSquare,
  Volume2,
  Wifi,
} from 'lucide-react';
import type { AppId } from '../../types';
import { currentMission } from '../../data/missions';
import { useClock, useOS, useOSApi } from '../../hooks/useOS';

const PINNED: { id: AppId; label: string; Icon: typeof Folder }[] = [
  { id: 'explorer', label: 'Files', Icon: Folder },
  { id: 'terminal', label: 'Terminal', Icon: TerminalSquare },
  { id: 'academy', label: 'Academy', Icon: GraduationCap },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function Taskbar() {
  const { windows, focusedId, startOpen, progress } = useOS();
  const api = useOSApi();
  const tick = useClock();
  const now = new Date(tick * 1000);
  const mission = currentMission(progress.completedMissionIds);
  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <footer className="taskbar">
      <button type="button" className={`start-btn${startOpen ? ' is-on' : ''}`} onClick={() => api.toggleStart()} aria-expanded={startOpen}>
        TA
      </button>
      <button type="button" className="search-chip" onClick={() => api.openApp('help')} aria-label="Help">
        <Search size={14} strokeWidth={1.5} />
        <span>Help</span>
      </button>
      <div className="taskbar-pins">
        {PINNED.map((p) => {
          const open = windows.some((w) => w.appId === p.id);
          const focused = windows.some((w) => w.appId === p.id && w.id === focusedId && !w.minimized);
          return (
            <button
              key={p.id}
              type="button"
              className={`tb-app${open ? ' is-open' : ''}${focused ? ' is-focus' : ''}`}
              aria-label={p.label}
              onClick={() => {
                const win = windows.find((w) => w.appId === p.id);
                if (win) api.toggleMin(win.id);
                else api.openApp(p.id);
              }}
            >
              <p.Icon size={18} strokeWidth={1.5} />
            </button>
          );
        })}
        {windows
          .filter((w) => !PINNED.some((p) => p.id === w.appId))
          .map((w) => (
            <button
              key={w.id}
              type="button"
              className={`tb-app is-open${focusedId === w.id ? ' is-focus' : ''}`}
              onClick={() => api.toggleMin(w.id)}
            >
              {w.title.slice(0, 1)}
            </button>
          ))}
      </div>
      {mission && (
        <button type="button" className="mission-chip" onClick={() => api.openApp('academy')}>
          {mission.title}
        </button>
      )}
      <div className="tray">
        <span className="tray-ico" title="Network: simulated">
          <Wifi size={14} strokeWidth={1.5} />
        </span>
        <span className="tray-ico" title="Volume: simulated">
          <Volume2 size={14} strokeWidth={1.5} />
        </span>
        <span className="tray-ico" title="Battery: simulated">
          <BatteryMedium size={14} strokeWidth={1.5} />
        </span>
        <time dateTime={now.toISOString()}>
          <strong>{time}</strong>
          <span>{date}</span>
        </time>
      </div>
      {startOpen && (
        <div className="start-menu" role="menu">
          <p className="start-word">Terminal Academy</p>
          <button type="button" onClick={() => api.openApp('terminal')}>
            <TerminalSquare size={16} strokeWidth={1.5} /> Terminal
          </button>
          <button type="button" onClick={() => api.openApp('explorer')}>
            <Folder size={16} strokeWidth={1.5} /> File Explorer
          </button>
          <button type="button" onClick={() => api.openApp('academy')}>
            <GraduationCap size={16} strokeWidth={1.5} /> Academy
          </button>
          <button type="button" onClick={() => api.openApp('settings')}>
            <Settings size={16} strokeWidth={1.5} /> Settings
          </button>
          <button type="button" onClick={() => api.openApp('help')}>
            <HelpCircle size={16} strokeWidth={1.5} /> Help
          </button>
        </div>
      )}
    </footer>
  );
}
