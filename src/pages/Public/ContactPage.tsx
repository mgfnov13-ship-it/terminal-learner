import { useState, type FormEvent } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase/client';
import { validateEmail } from '../../features/auth/validation';

const TOPICS = ['General question', 'Bug report', 'Learning feedback', 'Partnership / business'];

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return; // silently drop bot submissions
    if (!name.trim()) return setError('Enter your name.');
    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);
    if (!message.trim()) return setError('Enter a message.');

    if (!isSupabaseConfigured) {
      setError(
        "Terminal Space isn't connected to a message inbox yet, so this form can't submit right now. Try again later.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({ name: name.trim(), email: email.trim(), topic, message: message.trim() });
    setSubmitting(false);
    if (dbError) {
      setError("We couldn't send that right now. Try again.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="kicker">Message sent</p>
          <h1>Thanks — we got it.</h1>
          <p className="lede">We read every message. There's no automated reply, so we'll get back to you directly.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">Contact</p>
        <h1>Get in touch</h1>
        {!isSupabaseConfigured && (
          <p className="auth-note">
            Terminal Space isn't connected to a message inbox yet — this form is ready, but nothing will submit until
            one is configured.
          </p>
        )}
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="contact-topic">Topic</label>
          <select id="contact-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />

          {/* Honeypot — hidden from real visitors, invisible-labelled for screen readers to skip it too. */}
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
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  );
}
