import { useState, type FormEvent } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase/client';
import { validateEmail } from '../../features/auth/validation';
import { VALIDATION_COPY } from '../../features/auth/validation';
import { CONTACT_COPY } from '../../data/pageCopy';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function ContactPage() {
  const { t, bi } = usePreferences();
  usePageTitle(t('contact'));
  const topics = CONTACT_COPY.topics;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(topics[0].en);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    if (!name.trim()) return setError(bi(CONTACT_COPY.enterName));
    const emailError = validateEmail(email);
    if (emailError) return setError(bi(VALIDATION_COPY[emailError]));
    if (!message.trim()) return setError(bi(CONTACT_COPY.enterMessage));

    if (!isSupabaseConfigured) {
      setError(bi(CONTACT_COPY.inboxDown));
      return;
    }

    setSubmitting(true);
    setError(null);
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({ name: name.trim(), email: email.trim(), topic, message: message.trim() });
    setSubmitting(false);
    if (dbError) {
      setError(bi(CONTACT_COPY.sendFailed));
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="kicker">{bi(CONTACT_COPY.sentKicker)}</p>
          <h1>{bi(CONTACT_COPY.sentTitle)}</h1>
          <p className="lede">{bi(CONTACT_COPY.sentBody)}</p>
        </div>
      </section>
    );
  }

  const errorId = 'contact-error';

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">{bi(CONTACT_COPY.kicker)}</p>
        <h1>{bi(CONTACT_COPY.title)}</h1>
        {!isSupabaseConfigured && <p className="auth-note">{bi(CONTACT_COPY.notConnected)}</p>}
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="contact-name">{bi(CONTACT_COPY.name)}</label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            aria-invalid={error === bi(CONTACT_COPY.enterName) || undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="contact-email">{bi(CONTACT_COPY.email)}</label>
          <input
            id="contact-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            value={email}
            aria-invalid={Boolean(error && error !== bi(CONTACT_COPY.enterName) && error !== bi(CONTACT_COPY.enterMessage)) || undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="contact-topic">{bi(CONTACT_COPY.topic)}</label>
          <select id="contact-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((item) => (
              <option key={item.en} value={item.en}>
                {bi(item)}
              </option>
            ))}
          </select>

          <label htmlFor="contact-message">{bi(CONTACT_COPY.message)}</label>
          <textarea
            id="contact-message"
            rows={5}
            autoComplete="off"
            value={message}
            aria-invalid={error === bi(CONTACT_COPY.enterMessage) || undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => setMessage(e.target.value)}
          />

          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="honeypot"
            aria-hidden="true"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          {error && (
            <p className="field-error" role="alert" id={errorId}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? t('sending') : t('sendMessage')}
          </button>
        </form>
      </div>
    </section>
  );
}
