import { useEffect, useRef, type ReactNode } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import type { AppId, WindowRecord } from '../../types';
import { useOSApi } from '../../hooks/useOS';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import type { MessageKey } from '../../lib/i18n';

const TITLE_KEY: Record<AppId, MessageKey> = {
  terminal: 'terminal',
  explorer: 'fileExplorer',
  thispc: 'thisPc',
  recycle: 'recycleBin',
  academy: 'guide',
  settings: 'settings',
  help: 'help',
};

const ICONS: Record<string, ReactNode> = {};

interface Props {
  win: WindowRecord;
  icon: ReactNode;
  children: ReactNode;
  focused: boolean;
  awaiting?: boolean;
}

export function AppWindow({ win, icon, children, focused, awaiting }: Props) {
  const api = useOSApi();
  const { t } = usePreferences();
  const title = t(TITLE_KEY[win.appId] ?? 'terminal');
  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(null);
  const resize = useRef<{ ox: number; oy: number; sw: number; sh: number } | null>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (drag.current) {
        api.moveWindow(win.id, drag.current.sx + e.clientX - drag.current.ox, drag.current.sy + e.clientY - drag.current.oy);
      }
      if (resize.current) {
        api.resizeWindow(
          win.id,
          Math.max(280, resize.current.sw + e.clientX - resize.current.ox),
          Math.max(200, resize.current.sh + e.clientY - resize.current.oy),
        );
      }
    };
    const up = () => {
      drag.current = null;
      resize.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [api, win.id]);

  const style = win.maximized
    ? { left: 0, top: 0, width: '100%', height: '100%', zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      className={`app-window${focused ? ' is-focused' : ''}${win.minimized ? ' is-min' : ''}${win.maximized ? ' is-max' : ''}${awaiting ? ' is-awaiting' : ''}`}
      style={style}
      onPointerDown={() => api.focus(win.id)}
      aria-label={title}
    >
      <header
        className="titlebar"
        onPointerDown={(e) => {
          if (win.maximized) return;
          if ((e.target as HTMLElement).closest('button')) return;
          drag.current = { ox: e.clientX, oy: e.clientY, sx: win.x, sy: win.y };
        }}
        onDoubleClick={() => api.toggleMax(win.id)}
      >
        <span className="titlebar-icon">{icon}</span>
        <span className="titlebar-name">{title}</span>
        <div className="titlebar-actions">
          <button type="button" aria-label={t('minimize')} onClick={() => api.toggleMin(win.id)}>
            <Minus size={14} strokeWidth={1.5} />
          </button>
          <button type="button" aria-label={win.maximized ? t('restoreWindow') : t('maximize')} onClick={() => api.toggleMax(win.id)}>
            {win.maximized ? <Copy size={12} strokeWidth={1.5} /> : <Square size={12} strokeWidth={1.5} />}
          </button>
          <button type="button" className="is-close" aria-label={t('close')} onClick={() => api.closeWindow(win.id)}>
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      </header>
      <div className="app-window-body">{children}</div>
      {!win.maximized && (
        <span
          className="resize-handle"
          aria-hidden="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            resize.current = { ox: e.clientX, oy: e.clientY, sw: win.w, sh: win.h };
          }}
        />
      )}
    </section>
  );
}

void ICONS;
