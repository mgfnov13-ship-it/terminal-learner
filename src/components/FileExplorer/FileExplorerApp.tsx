import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  File as FileIcon,
  Folder,
  HardDrive,
  Home,
  Image,
  RefreshCw,
  Search,
} from 'lucide-react';
import type { FSNode, WindowRecord } from '../../types';
import { HOME } from '../../engine/paths';
import { useOS, useOSApi } from '../../hooks/useOS';

const SIDE = [
  { label: 'This PC', path: 'C:\\', icon: HardDrive },
  { label: 'Desktop', path: `${HOME}\\Desktop`, icon: Home },
  { label: 'Documents', path: `${HOME}\\Documents`, icon: Folder },
  { label: 'Downloads', path: `${HOME}\\Downloads`, icon: Folder },
  { label: 'Pictures', path: `${HOME}\\Pictures`, icon: Image },
  { label: 'C:', path: 'C:\\', icon: HardDrive },
];

export function FileExplorerApp({ win }: { win: WindowRecord }) {
  const { vfs, renamingId } = useOS();
  const api = useOSApi();
  const [query, setQuery] = useState('');
  const path = win.explorerPath ?? HOME;
  const history = win.explorerHistory ?? [path];
  const index = win.explorerIndex ?? 0;
  const view = win.explorerView ?? 'grid';
  const folder = vfs.findByPath(path);
  const items = folder ? vfs.childrenOf(folder.id) : [];
  const visible = items.filter((n) => n.name.toLowerCase().includes(query.toLowerCase()));

  const go = (next: string, push = true) => {
    if (push) {
      const hist = history.slice(0, index + 1);
      hist.push(next);
      api.updateWindow(win.id, { explorerPath: next, explorerHistory: hist, explorerIndex: hist.length - 1 });
    } else {
      api.updateWindow(win.id, { explorerPath: next });
    }
  };

  const stamp = (ms: number) =>
    new Date(ms).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const crumbs = useMemo(() => {
    const parts = path.split('\\').filter(Boolean);
    return parts.map((part, i) => ({
      name: part,
      path: parts.slice(0, i + 1).join('\\'),
    }));
  }, [path]);

  const openNode = (node: FSNode) => {
    if (node.type === 'folder') go(vfs.nodePath(node.id));
  };

  return (
    <div className="explorer">
      <div className="explorer-toolbar">
        <button
          type="button"
          aria-label="Back"
          disabled={index <= 0}
          onClick={() =>
            api.updateWindow(win.id, { explorerPath: history[index - 1], explorerIndex: index - 1 })
          }
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="Forward"
          disabled={index >= history.length - 1}
          onClick={() =>
            api.updateWindow(win.id, { explorerPath: history[index + 1], explorerIndex: index + 1 })
          }
        >
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="Up"
          onClick={() => {
            const parts = path.split('\\').filter(Boolean);
            go(parts.length <= 1 ? 'C:\\' : parts.slice(0, -1).join('\\'));
          }}
        >
          <ArrowUp size={16} strokeWidth={1.5} />
        </button>
        <button type="button" aria-label="Refresh" onClick={() => api.completeFromExplorer()}>
          <RefreshCw size={16} strokeWidth={1.5} />
        </button>
        <div className="address">
          {crumbs.map((c) => (
            <button type="button" key={c.path} onClick={() => go(c.path)}>
              {c.name}
            </button>
          ))}
        </div>
        <label className="explorer-search">
          <Search size={14} strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this folder"
            aria-label="Search this folder"
          />
        </label>
        <div className="view-toggle">
          <button type="button" className={view === 'grid' ? 'is-on' : ''} onClick={() => api.updateWindow(win.id, { explorerView: 'grid' })}>
            Grid
          </button>
          <button type="button" className={view === 'list' ? 'is-on' : ''} onClick={() => api.updateWindow(win.id, { explorerView: 'list' })}>
            List
          </button>
        </div>
      </div>
      <div className="explorer-main">
        <aside className="explorer-side">
          {SIDE.map((s) => (
            <button key={s.label + s.path} type="button" className={path.toLowerCase() === s.path.toLowerCase() ? 'is-on' : ''} onClick={() => go(s.path)}>
              <s.icon size={16} strokeWidth={1.5} />
              {s.label}
            </button>
          ))}
        </aside>
        <div
          className={`explorer-files is-${view}`}
          onContextMenu={(e) => {
            e.preventDefault();
            api.setContextMenu({ x: e.clientX, y: e.clientY, path });
          }}
        >
          {!visible.length && (
            <div className="empty-state">
              <p>This folder is empty.</p>
              <p>Create a folder from Terminal or right-click here.</p>
            </div>
          )}
          {visible.map((node) => (
            <div
              key={node.id}
              className="fs-item"
              onDoubleClick={() => openNode(node)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                api.setContextMenu({ x: e.clientX, y: e.clientY, path, nodeId: node.id });
              }}
            >
              {node.type === 'folder' ? <Folder size={28} strokeWidth={1.4} /> : <FileIcon size={28} strokeWidth={1.4} />}
              {renamingId === node.id ? (
                <input
                  className="rename-input"
                  defaultValue={node.name}
                  autoFocus
                  onBlur={(e) => api.explorerRename(node.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') api.explorerRename(node.id, (e.target as HTMLInputElement).value);
                    if (e.key === 'Escape') api.setRenaming(null);
                  }}
                />
              ) : (
                <span className="fs-name">{node.name}</span>
              )}
              {view === 'list' && (
                <>
                  <span className="fs-kind">{node.type === 'folder' ? 'Folder' : 'Text file'}</span>
                  <span className="fs-date">{stamp(node.modifiedAt)}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
