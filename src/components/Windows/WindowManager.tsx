import {
  Folder,
  GraduationCap,
  HelpCircle,
  Monitor,
  Settings,
  TerminalSquare,
  Trash2,
} from 'lucide-react';
import type { AppId, WindowRecord } from '../../types';
import { useOS } from '../../hooks/useOS';
import { AcademyApp } from '../Academy/AcademyApp';
import { FileExplorerApp } from '../FileExplorer/FileExplorerApp';
import { HelpApp } from '../Help/HelpApp';
import { RecycleBinApp } from '../RecycleBin/RecycleBinApp';
import { SettingsApp } from '../Settings/SettingsApp';
import { TerminalApp } from '../Terminal/TerminalApp';
import { AppWindow } from './AppWindow';

const ICON: Record<AppId, typeof Folder> = {
  explorer: Folder,
  thispc: Monitor,
  terminal: TerminalSquare,
  recycle: Trash2,
  academy: GraduationCap,
  settings: Settings,
  help: HelpCircle,
};

export function WindowManager() {
  const { windows, focusedId } = useOS();

  return (
    <>
      {windows.map((win) => {
        const Icon = ICON[win.appId];
        return (
          <AppWindow
            key={win.id}
            win={win}
            focused={focusedId === win.id}
            icon={<Icon size={14} strokeWidth={1.5} />}
          >
            <WindowBody win={win} />
          </AppWindow>
        );
      })}
    </>
  );
}

function WindowBody({ win }: { win: WindowRecord }) {
  switch (win.appId) {
    case 'terminal':
      return <TerminalApp />;
    case 'explorer':
    case 'thispc':
      return <FileExplorerApp win={win} />;
    case 'recycle':
      return <RecycleBinApp />;
    case 'academy':
      return <AcademyApp />;
    case 'settings':
      return <SettingsApp />;
    case 'help':
      return <HelpApp />;
    default:
      return null;
  }
}
