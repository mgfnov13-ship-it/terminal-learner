import { useEffect, useId, useRef, useState } from 'react';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function ResetProgressModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState('');
  const ready = typed.trim() === 'RESET';
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const { t, bi } = usePreferences();

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClose={() => returnFocusRef.current?.focus()}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
    >
      <h2 id={titleId}>{bi({ en: 'Reset all learning progress?', ar: 'إعادة ضبط كل تقدّم التعلّم؟' })}</h2>
      <p>{bi({ en: 'This will permanently remove:', ar: 'سيُحذف نهائياً:' })}</p>
      <ul className="reset-list">
        <li>{bi({ en: 'Completed lessons and steps', ar: 'الدروس والخطوات المكتملة' })}</li>
        <li>{bi({ en: 'Completed missions', ar: 'المهام المكتملة' })}</li>
        <li>{bi({ en: 'XP and player level', ar: 'نقاط الخبرة ومستوى اللاعب' })}</li>
        <li>{bi({ en: 'Achievements', ar: 'الإنجازات' })}</li>
        <li>{bi({ en: 'The simulated filesystem', ar: 'القرص المحاكى' })}</li>
      </ul>
      <p>{bi({ en: 'Your account will remain active.', ar: 'سيبقى حسابك فعّالاً.' })}</p>
      <label htmlFor="reset-confirm-input" className="ts-field">
        <span className="ts-field__label">{t('typeReset')}</span>
        <input
          id="reset-confirm-input"
          type="text"
          autoComplete="off"
          dir="ltr"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
        />
      </label>
      <div className="row-actions">
        <button type="button" onClick={onCancel}>
          {t('cancel')}
        </button>
        <button type="button" className="btn-danger" disabled={!ready} onClick={onConfirm}>
          {t('resetProgress')}
        </button>
      </div>
    </dialog>
  );
}
