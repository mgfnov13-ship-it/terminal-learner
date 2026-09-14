import type { ReactNode } from 'react';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function InlineNotice({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="inline-notice" data-tone={tone} role={tone === 'error' ? 'alert' : 'status'} aria-atomic="true">
      <strong>{title}</strong>
      {children ? <div>{children}</div> : null}
    </div>
  );
}

export function LiveRegion({ children }: { children: ReactNode }) {
  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {children}
    </div>
  );
}

export function LoadingSkeleton({ label }: { label?: string }) {
  const { t } = usePreferences();
  return (
    <div className="auth-loading-shell" role="status" aria-label={label ?? t('loading')} aria-busy="true">
      <span className="auth-loading-mark" aria-hidden>
        &gt;_
      </span>
      <p>{label ?? t('loading')}</p>
    </div>
  );
}
