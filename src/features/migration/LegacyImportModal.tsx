import { useEffect, useId, useRef } from 'react';
import type { PersistedState } from '../../types';
import { filesLessonProgress } from '../../engine/tutorial';
import { usePreferences } from '../preferences/PreferencesProvider';

export function LegacyImportModal({
  legacy,
  onImport,
  onStartFresh,
}: {
  legacy: PersistedState;
  onImport: () => void;
  onStartFresh: () => void;
}) {
  const { bi } = usePreferences();
  const files = filesLessonProgress(legacy.progress);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const lessonWord =
    files.done === 1
      ? bi({ en: 'lesson', ar: 'درس' })
      : bi({ en: 'lessons', ar: 'دروس' });

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Sync waits for an explicit choice; Escape must not dismiss this.
        event.preventDefault();
      }}
    >
      <h2 id={titleId}>{bi({ en: 'We found progress on this device', ar: 'وجدنا تقدّماً على هذا الجهاز' })}</h2>
      <p>
        {bi({
          en: `Files — ${files.done} ${lessonWord} completed, ${legacy.progress.xp.toLocaleString()} XP.`,
          ar: `الملفات — اكتمل ${files.done} ${lessonWord}، ${legacy.progress.xp.toLocaleString()} XP.`,
        })}
      </p>
      <p>{bi({ en: 'Would you like to add this progress to your account?', ar: 'هل تريد إضافة هذا التقدّم إلى حسابك؟' })}</p>
      <div className="row-actions">
        <button type="button" onClick={onStartFresh}>
          {bi({ en: 'Start fresh', ar: 'ابدأ من جديد' })}
        </button>
        <button type="button" className="btn-primary" onClick={onImport}>
          {bi({ en: 'Import progress', ar: 'استيراد التقدّم' })}
        </button>
      </div>
    </dialog>
  );
}
