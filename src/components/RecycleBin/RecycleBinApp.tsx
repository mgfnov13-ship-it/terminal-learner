import { Trash2 } from 'lucide-react';
import { useOS, useOSApi } from '../../hooks/useOS';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function RecycleBinApp() {
  const { t, bi } = usePreferences();
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
              title: t('emptyRecycle'),
              body: t('emptyRecycleConfirm'),
              confirmLabel: t('emptyRecycle'),
              danger: true,
              onConfirm: () => api.emptyRecycle(),
            })
          }
        >
          {t('emptyRecycle')}
        </button>
      </div>
      {!items.length ? (
        <div className="empty-state">
          <Trash2 size={28} strokeWidth={1.4} />
          <p>{t('recycleEmpty')}</p>
          <p>{t('recycleEmptyHint')}</p>
        </div>
      ) : (
        <ul className="recycle-list">
          {items.map((entry, i) => (
            <li key={entry.node.id}>
              <div>
                <strong>{entry.node.name}</strong>
                <span dir="ltr">{entry.originalPath}</span>
              </div>
              <div className="row-actions">
                <button type="button" onClick={() => api.restoreRecycle(i)}>
                  {t('restore')}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    api.askConfirm({
                      title: bi({ en: `Delete ${entry.node.name}`, ar: `حذف ${entry.node.name}` }),
                      body: bi({
                        en: 'Permanently delete this item from Recycle Bin?',
                        ar: 'حذف هذا العنصر نهائياً من سلة المحذوفات؟',
                      }),
                      confirmLabel: t('deletePermanently'),
                      danger: true,
                      onConfirm: () => api.purgeRecycle(i),
                    })
                  }
                >
                  {t('deletePermanently')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
