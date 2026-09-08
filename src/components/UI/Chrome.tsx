import { useOS, useOSApi } from '../../hooks/useOS';

export function ToastStack() {
  const { toasts } = useOS();
  const api = useOSApi();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} type="button" className={`toast is-${t.kind}`} onClick={() => api.dismissToast(t.id)}>
          <strong>{t.title}</strong>
          {t.body && <span>{t.body}</span>}
        </button>
      ))}
    </div>
  );
}

export function ConfirmDialog() {
  const { confirm } = useOS();
  const api = useOSApi();
  if (!confirm) return null;
  return (
    <div className="modal-scrim" onClick={() => api.cancelConfirm()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-title">{confirm.title}</h2>
        <p>{confirm.body}</p>
        <div className="row-actions">
          <button type="button" onClick={() => api.cancelConfirm()}>
            Cancel
          </button>
          <button type="button" className={confirm.danger ? 'btn-danger' : 'btn-primary'} onClick={() => api.runConfirm()}>
            {confirm.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContextMenu() {
  const { contextMenu, vfs } = useOS();
  const api = useOSApi();
  if (!contextMenu) return null;
  const { x, y, path, nodeId } = contextMenu;
  const node = nodeId ? vfs.get(nodeId) : undefined;
  return (
    <div className="ctx" style={{ left: x, top: y }} role="menu">
      {node && (
        <button
          type="button"
          onClick={() => {
            if (node.type === 'folder') api.openApp('explorer', vfs.nodePath(node.id));
            api.setContextMenu(null);
          }}
        >
          Open
        </button>
      )}
      {nodeId && (
        <button type="button" onClick={() => { api.setRenaming(nodeId); api.setContextMenu(null); }}>
          Rename
        </button>
      )}
      {nodeId && (
        <button type="button" onClick={() => { api.explorerCopy(nodeId); api.setContextMenu(null); }}>
          Copy
        </button>
      )}
      {nodeId && (
        <button
          type="button"
          onClick={() => {
            api.explorerDelete(nodeId);
            api.setContextMenu(null);
          }}
        >
          Delete
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          api.explorerNewFolder(path);
          api.setContextMenu(null);
        }}
      >
        New folder
      </button>
      <button type="button" onClick={() => { api.completeFromExplorer(); api.setContextMenu(null); }}>
        Refresh
      </button>
    </div>
  );
}

export function BurstLayer() {
  const { xpBurst, levelBurst } = useOS();
  return (
    <div className="bursts" aria-hidden>
      {xpBurst > 0 && <div className="xp-pop">+{xpBurst} XP</div>}
      {levelBurst && <div className="lvl-pop">Level {levelBurst}</div>}
    </div>
  );
}
