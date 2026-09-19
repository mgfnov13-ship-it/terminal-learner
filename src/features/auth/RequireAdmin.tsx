import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../preferences/PreferencesProvider';
import { isAdminEmail } from './admin';
import { useAuth } from './useAuth';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { bi } = usePreferences();

  if (!isAdminEmail(user?.email)) {
    return (
      <section className="admin-denied">
        <p className="kicker">{bi({ en: 'Restricted area', ar: 'منطقة مقيّدة' })}</p>
        <h1>{bi({ en: 'Administrator access required', ar: 'يلزم حساب مسؤول' })}</h1>
        <p className="lede">
          {bi({
            en: 'This account is not on the administrator list.',
            ar: 'هذا الحساب غير موجود في قائمة المسؤولين.',
          })}
        </p>
        <Link className="btn-secondary" to="/app">
          {bi({ en: 'Return to learning', ar: 'العودة إلى التعلّم' })}
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
