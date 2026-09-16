import { useEffect, useId, useRef } from 'react';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
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
  const { t } = usePreferences();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (confirm && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    }
    if (!confirm && dialog.open) dialog.close();
  }, [confirm]);

  return (
    <dialog
      className="confirm-dialog"
      ref={dialogRef}
      data-tone={confirm?.danger ? 'danger' : 'default'}
      aria-labelledby={titleId}
      aria-describedby={confirm?.body ? bodyId : undefined}
      onClose={() => {
        returnFocusRef.current?.focus();
        returnFocusRef.current = null;
      }}
      onCancel={(event) => {
        event.preventDefault();
        api.cancelConfirm();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) api.cancelConfirm();
      }}
    >
      {confirm ? (
        <>
          <h2 id={titleId}>{confirm.title}</h2>
          {confirm.body ? <p id={bodyId}>{confirm.body}</p> : null}
          <div className="row-actions">
            <button type="button" onClick={() => api.cancelConfirm()}>
              {t('cancel')}
            </button>
            <button
              type="button"
              className={confirm.danger ? 'btn-danger' : 'btn-primary'}
              onClick={() => api.runConfirm()}
            >
              {confirm.confirmLabel}
            </button>
          </div>
        </>
      ) : null}
    </dialog>
  );
}

export function ContextMenu() {
  const { contextMenu, vfs } = useOS();
  const api = useOSApi();
  const { bi } = usePreferences();
  if (!contextMenu) return null;
  const { x, y, path, nodeId } = contextMenu;
  const node = nodeId ? vfs.get(nodeId) : undefined;
  const menuW = 200;
  const menuH = 220;
  const left = Math.max(8, Math.min(x, window.innerWidth - menuW - 8));
  const top = Math.max(8, Math.min(y, window.innerHeight - menuH - 8));
  return (
    <div className="ctx" style={{ left, top }} role="menu">
      {node && (
        <button
          type="button"
          onClick={() => {
            if (node.type === 'folder') api.openApp('explorer', vfs.nodePath(node.id));
            api.setContextMenu(null);
          }}
        >
          {bi({ en: 'Open', ar: 'فتح' })}
        </button>
      )}
      {nodeId && (
        <button
          type="button"
          onClick={() => {
            api.setRenaming(nodeId);
            api.setContextMenu(null);
          }}
        >
          {bi({ en: 'Rename', ar: 'إعادة تسمية' })}
        </button>
      )}
      {nodeId && (
        <button
          type="button"
          onClick={() => {
            api.explorerCopy(nodeId);
            api.setContextMenu(null);
          }}
        >
          {bi({ en: 'Copy', ar: 'نسخ' })}
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
          {bi({ en: 'Delete', ar: 'حذف' })}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          api.explorerNewFolder(path);
          api.setContextMenu(null);
        }}
      >
        {bi({ en: 'New folder', ar: 'مجلد جديد' })}
      </button>
      <button
        type="button"
        onClick={() => {
          api.completeFromExplorer();
          api.setContextMenu(null);
        }}
      >
        {bi({ en: 'Refresh', ar: 'تحديث' })}
      </button>
    </div>
  );
}

export function BurstLayer() {
  const { xpBurst, levelBurst } = useOS();
  const { t } = usePreferences();
  return (
    <div className="bursts" aria-hidden>
      {xpBurst > 0 && <div className="xp-pop">+{xpBurst} XP</div>}
      {levelBurst && (
        <div className="lvl-pop">
          {t('level')} {levelBurst}
        </div>
      )}
    </div>
  );
}
