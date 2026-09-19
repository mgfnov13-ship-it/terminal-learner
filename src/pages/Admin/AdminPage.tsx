import { useEffect, useState } from 'react';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';
import { supabase } from '../../lib/supabase/client';

interface Member {
  id: string;
  display_name: string | null;
  onboarding_complete: boolean;
  created_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
}

interface AdminSnapshot {
  members: Member[];
  memberCount: number;
  onboardedCount: number;
  messages: ContactMessage[];
  messageCount: number;
}

const EMPTY_SNAPSHOT: AdminSnapshot = {
  members: [],
  memberCount: 0,
  onboardedCount: 0,
  messages: [],
  messageCount: 0,
};

function displayDate(value: string, language: string): string {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', { dateStyle: 'medium' }).format(new Date(value));
}

export function AdminPage() {
  const { bi, language } = usePreferences();
  usePageTitle(bi({ en: 'Admin', ar: 'الإدارة' }));
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);

    async function loadSnapshot() {
      try {
        const [members, memberCount, onboardedCount, messages, messageCount] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, display_name, onboarding_complete, created_at')
            .order('created_at', { ascending: false })
            .limit(16),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('onboarding_complete', true),
          supabase
            .from('contact_submissions')
            .select('id, name, email, topic, message, created_at')
            .order('created_at', { ascending: false })
            .limit(20),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        ]);

        const firstError = [members, memberCount, onboardedCount, messages, messageCount].find((result) => result.error);
        if (firstError) throw firstError.error;
        if (!active) return;

        setSnapshot({
          members: (members.data ?? []) as Member[],
          memberCount: memberCount.count ?? 0,
          onboardedCount: onboardedCount.count ?? 0,
          messages: (messages.data ?? []) as ContactMessage[],
          messageCount: messageCount.count ?? 0,
        });
      } catch (error) {
        if (!active) return;
        console.error('Terminal Space: admin data sync failed.', error);
        setSnapshot(EMPTY_SNAPSHOT);
        setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSnapshot();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const statCards = [
    {
      label: bi({ en: 'Learner accounts', ar: 'حسابات المتعلّمين' }),
      value: snapshot.memberCount,
      detail: bi({ en: 'Registered profiles', ar: 'ملفات مسجّلة' }),
    },
    {
      label: bi({ en: 'Onboarding complete', ar: 'أكملوا الإعداد' }),
      value: snapshot.onboardedCount,
      detail: bi({ en: 'Learners ready to study', ar: 'متعلّمون جاهزون للدراسة' }),
    },
    {
      label: bi({ en: 'Contact messages', ar: 'رسائل التواصل' }),
      value: snapshot.messageCount,
      detail: bi({ en: 'All submitted messages', ar: 'كل الرسائل المرسلة' }),
    },
  ];

  return (
    <div className="admin-page">
      <section className="dash-head admin-head">
        <p className="kicker">{bi({ en: 'Administration', ar: 'الإدارة' })}</p>
        <h1>{bi({ en: 'Terminal Space overview', ar: 'نظرة عامة على تيرمنال سبيس' })}</h1>
        <p className="lede">
          {bi({
            en: 'Review learner accounts, onboarding, and recent contact messages.',
            ar: 'راجع حسابات المتعلّمين وإعدادهم ورسائل التواصل الأخيرة.',
          })}
        </p>
        <button type="button" className="btn-secondary" onClick={() => setReloadKey((key) => key + 1)} disabled={loading}>
          {loading ? bi({ en: 'Refreshing…', ar: 'جارٍ التحديث…' }) : bi({ en: 'Refresh data', ar: 'تحديث البيانات' })}
        </button>
      </section>

      {failed && (
        <p className="admin-error" role="alert">
          {bi({
            en: 'Admin data could not be loaded. Check that the Supabase admin access migration is applied.',
            ar: 'تعذر تحميل بيانات الإدارة. تحقّق من تطبيق ترحيل صلاحيات المسؤول في Supabase.',
          })}
        </p>
      )}

      <section className="admin-stats" aria-label={bi({ en: 'Account statistics', ar: 'إحصاءات الحسابات' })}>
        {statCards.map((stat) => (
          <article className="panel admin-stat" key={stat.label}>
            <p className="section-index">{stat.label}</p>
            <p className="admin-stat-value" aria-live="polite">
              {loading ? '—' : stat.value.toLocaleString(language)}
            </p>
            <p className="panel-note">{stat.detail}</p>
          </article>
        ))}
      </section>

      <div className="admin-columns">
        <section className="panel admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="section-index">{bi({ en: 'Learners', ar: 'المتعلّمون' })}</p>
              <h2>{bi({ en: 'Latest accounts', ar: 'أحدث الحسابات' })}</h2>
            </div>
            <span className="admin-count">{snapshot.members.length} / 16</span>
          </div>
          {loading ? (
            <p className="empty-copy">{bi({ en: 'Loading learner accounts…', ar: 'جارٍ تحميل حسابات المتعلّمين…' })}</p>
          ) : snapshot.members.length === 0 ? (
            <p className="empty-copy">{bi({ en: 'No learner accounts yet.', ar: 'لا توجد حسابات متعلّمين بعد.' })}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="spec admin-table">
                <thead>
                  <tr>
                    <th scope="col">{bi({ en: 'Learner', ar: 'المتعلّم' })}</th>
                    <th scope="col">{bi({ en: 'Joined', ar: 'تاريخ الانضمام' })}</th>
                    <th scope="col">{bi({ en: 'Setup', ar: 'الإعداد' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.members.map((member) => (
                    <tr key={member.id}>
                      <th scope="row">
                        <span>{member.display_name || bi({ en: 'Unnamed learner', ar: 'متعلّم بلا اسم' })}</span>
                        <code className="admin-user-id">{member.id}</code>
                      </th>
                      <td>{displayDate(member.created_at, language)}</td>
                      <td>
                        <span className={`status${member.onboarding_complete ? ' is-open' : ''}`}>
                          {member.onboarding_complete
                            ? bi({ en: 'Complete', ar: 'مكتمل' })
                            : bi({ en: 'Pending', ar: 'قيد الانتظار' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="section-index">{bi({ en: 'Inbox', ar: 'الوارد' })}</p>
              <h2>{bi({ en: 'Recent messages', ar: 'الرسائل الأخيرة' })}</h2>
            </div>
            <span className="admin-count">{snapshot.messages.length} / 20</span>
          </div>
          {loading ? (
            <p className="empty-copy">{bi({ en: 'Loading contact messages…', ar: 'جارٍ تحميل رسائل التواصل…' })}</p>
          ) : snapshot.messages.length === 0 ? (
            <p className="empty-copy">{bi({ en: 'The inbox is empty.', ar: 'صندوق الوارد فارغ.' })}</p>
          ) : (
            <div className="admin-message-list">
              {snapshot.messages.map((message) => (
                <article className="admin-message" key={message.id}>
                  <header>
                    <div>
                      <h3>{message.name}</h3>
                      <a href={`mailto:${message.email}`}>{message.email}</a>
                    </div>
                    <time dateTime={message.created_at}>{displayDate(message.created_at, language)}</time>
                  </header>
                  <p className="admin-message-topic">{message.topic}</p>
                  <p className="admin-message-body">{message.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
