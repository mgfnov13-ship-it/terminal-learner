import { Trash2 } from 'lucide-react';
import { useOS, useOSApi } from '../../hooks/useOS';

export function RecycleBinApp() {
  const { vfs } = useOS();
  const api = useOSApi();
  const items = vfs.recycle;

  return (
    <div className="recycle">
      <div className="recycle-bar">
        <button
          type="button"
          className="btn-danger"
          disabled={!items.length}
          onClick={() =>
            api.askConfirm({
              title: 'Empty Recycle Bin',
              body: 'Permanently delete every item in Recycle Bin? This cannot be undone.',
              confirmLabel: 'Empty Recycle Bin',
              danger: true,
              onConfirm: () => api.emptyRecycle(),
            })
          }
        >
          Empty Recycle Bin
        </button>
      </div>
      {!items.length ? (
        <div className="empty-state">
          <Trash2 size={28} strokeWidth={1.4} />
          <p>Recycle Bin is empty.</p>
          <p>Deleted files from Explorer land here until you restore or empty them.</p>
        </div>
      ) : (
        <ul className="recycle-list">
          {items.map((entry, i) => (
            <li key={entry.node.id}>
              <div>
                <strong>{entry.node.name}</strong>
                <span>{entry.originalPath}</span>
              </div>
              <div className="row-actions">
                <button type="button" onClick={() => api.restoreRecycle(i)}>
                  Restore
                </button>
                <button
                  type="button"
                  onClick={() =>
                    api.askConfirm({
                      title: `Delete ${entry.node.name}`,
                      body: 'Permanently delete this item from Recycle Bin?',
                      confirmLabel: 'Delete permanently',
                      danger: true,
                      onConfirm: () => api.purgeRecycle(i),
                    })
                  }
                >
                  Delete permanently
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
