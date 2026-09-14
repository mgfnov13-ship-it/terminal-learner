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
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { lessonSubtitle, lessonTitle } from '../../lib/localizeContent';

export function Desktop() {
  const { t, language } = usePreferences();
  const { progress, settings, vfs, windows } = useOS();
  const api = useOSApi();
  const lesson = activeLesson(progress);
  const academyOpen = windows.some((w) => w.appId === 'academy' && !w.minimized);
  const desktopFiles = vfs.list('C:\\Users\\Student\\Desktop');
  const slip = !academyOpen && !progress.completedLessonIds.includes(FILES_LESSONS[FILES_LESSONS.length - 1]?.id ?? '');

  const icons = [
    { id: 'thispc' as const, label: t('thisPc'), Icon: Monitor },
    { id: 'explorer' as const, label: t('files'), Icon: Folder },
    { id: 'terminal' as const, label: t('terminal'), Icon: TerminalSquare },
    { id: 'recycle' as const, label: t('recycleBin'), Icon: Trash2 },
    { id: 'settings' as const, label: t('settings'), Icon: Settings },
    { id: 'academy' as const, label: t('guide'), Icon: GraduationCap },
    { id: 'help' as const, label: t('help'), Icon: HelpCircle },
  ];

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
        {icons.map((icon) => (
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
          <p className="slip-kicker">{t('todaysLesson')}</p>
          <h2>{lessonTitle(lesson.id, language)}</h2>
          <p>{lessonSubtitle(lesson.id, language)}</p>
          {settings.showHints && <p className="slip-hint">{t('openGuideHint')}</p>}
          <button type="button" onClick={() => api.openApp('academy')}>
            {t('openGuide')}
          </button>
        </aside>
      )}
    </div>
  );
}
