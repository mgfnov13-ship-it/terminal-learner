import type { PersistedState } from '../../types';
import { filesLessonProgress } from '../../engine/tutorial';

export function LegacyImportModal({
  legacy,
  onImport,
  onStartFresh,
}: {
  legacy: PersistedState;
  onImport: () => void;
  onStartFresh: () => void;
}) {
  const files = filesLessonProgress(legacy.progress);
  return (
    <div className="modal-scrim">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <h2 id="import-title">We found progress on this device</h2>
        <p>
          Files — {files.done} {files.done === 1 ? 'lesson' : 'lessons'} completed, {legacy.progress.xp.toLocaleString()}{' '}
          XP.
        </p>
        <p>Would you like to add this progress to your account?</p>
        <div className="row-actions">
          <button type="button" onClick={onStartFresh}>
            Start fresh
          </button>
          <button type="button" className="btn-primary" onClick={onImport}>
            Import progress
          </button>
        </div>
      </div>
    </div>
  );
}
