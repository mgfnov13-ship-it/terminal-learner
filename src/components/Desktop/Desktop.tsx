import {
  Folder,
  GraduationCap,
  HelpCircle,
  Monitor,
  Settings,
  TerminalSquare,
  Trash2,
} from 'lucide-react';
import { FILES_LESSONS } from '../../data/curriculum';
import { activeLesson } from '../../engine/tutorial';
import { useOS, useOSApi } from '../../hooks/useOS';

const ICONS = [
  { id: 'thispc' as const, label: 'This PC', Icon: Monitor },
  { id: 'explorer' as const, label: 'Files', Icon: Folder },
  { id: 'terminal' as const, label: 'Terminal', Icon: TerminalSquare },
  { id: 'recycle' as const, label: 'Recycle Bin', Icon: Trash2 },
  { id: 'settings' as const, label: 'Settings', Icon: Settings },
  { id: 'academy' as const, label: 'Academy', Icon: GraduationCap },
  { id: 'help' as const, label: 'Help', Icon: HelpCircle },
];

export function Desktop() {
  const { progress, settings, vfs, windows } = useOS();
  const api = useOSApi();
  const lesson = activeLesson(progress);
  const academyOpen = windows.some((w) => w.appId === 'academy' && !w.minimized);
  const desktopFiles = vfs.list('C:\\Users\\Student\\Desktop');
  const slip = !academyOpen && !progress.completedLessonIds.includes(FILES_LESSONS[FILES_LESSONS.length - 1]?.id ?? '');

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
      {slip && (
        <aside className="brief-slip">
          <p className="slip-kicker">Today’s lesson</p>
          <h2>{lesson.title}</h2>
          <p>{lesson.subtitle}</p>
          {settings.showHints && <p className="slip-hint">Open Academy to continue. The terminal is where you type.</p>}
          <button type="button" onClick={() => api.openApp('academy')}>
            Open Academy
          </button>
        </aside>
      )}
    </div>
  );
}
