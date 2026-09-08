import {
  Folder,
  GraduationCap,
  Monitor,
  Settings,
  TerminalSquare,
  Trash2,
} from 'lucide-react';
import { currentMission } from '../../data/missions';
import { useOS, useOSApi } from '../../hooks/useOS';

const ICONS = [
  { id: 'thispc' as const, label: 'This PC', Icon: Monitor },
  { id: 'explorer' as const, label: 'Files', Icon: Folder },
  { id: 'terminal' as const, label: 'Terminal', Icon: TerminalSquare },
  { id: 'recycle' as const, label: 'Recycle Bin', Icon: Trash2 },
  { id: 'settings' as const, label: 'Settings', Icon: Settings },
  { id: 'academy' as const, label: 'Academy', Icon: GraduationCap },
];

export function Desktop() {
  const { progress, settings, vfs } = useOS();
  const api = useOSApi();
  const mission = currentMission(progress.completedMissionIds);
  const desktopFiles = vfs.list('C:\\Users\\Student\\Desktop');

  return (
    <div
      className="desktop-surface"
      onClick={() => {
        api.toggleStart(false);
        api.setContextMenu(null);
      }}
    >
      <div className="wallpaper" aria-hidden />
      <nav className="desk-icons">
        {ICONS.map((icon) => (
          <button
            key={icon.id}
            type="button"
            className="desk-icon"
            onDoubleClick={() => api.openApp(icon.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') api.openApp(icon.id);
            }}
          >
            <icon.Icon size={28} strokeWidth={1.4} />
            <span>{icon.label}</span>
          </button>
        ))}
        {desktopFiles.map((file) => (
          <button
            key={file.id}
            type="button"
            className="desk-icon"
            onDoubleClick={() => api.openApp('explorer', 'C:\\Users\\Student\\Desktop')}
          >
            {file.type === 'folder' ? (
              <Folder size={28} strokeWidth={1.4} />
            ) : (
              <Monitor size={28} strokeWidth={1.4} />
            )}
            <span>{file.name}</span>
          </button>
        ))}
      </nav>
      {mission && (
        <aside className="brief-slip">
          <p className="slip-kicker">Tonight’s brief</p>
          <h2>{mission.title}</h2>
          <p>{mission.briefing}</p>
          {settings.showHints && <p className="slip-hint">{mission.hint}</p>}
          <button type="button" onClick={() => api.openApp('academy')}>
            Open Academy
          </button>
        </aside>
      )}
    </div>
  );
}
