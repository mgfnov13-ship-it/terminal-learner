import type { ReactNode } from 'react';
import { AccessibilityPanel, LanguageToggle } from '../A11y/AccessibilityPanel';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function AuthFrame({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { t } = usePreferences();
  return (
    <section className="auth-page">
      <div className="auth-utilities" role="group" aria-label={t('langAndA11y')}>
        <LanguageToggle />
        <AccessibilityPanel iconOnly />
      </div>
      <div className="auth-card">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {description ? <p className="lede">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
