import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <section className="legal">
      <p className="kicker">Privacy</p>
      <h1>Privacy policy</h1>
      <p className="lede">
        This is a plain-language summary of what Terminal Space stores and why. It is not a substitute for legal
        advice — treat it as a starting point for final review, not a finished legal document.
      </p>

      <h2>Account data</h2>
      <p>
        If you create an account, we store your email address and, once you set one, a display name — the minimum
        needed to sign you in and identify your progress. Authentication is handled by our database provider
        (Supabase); we never see or store your password in plain text.
      </p>

      <h2>Learning progress</h2>
      <p>
        Completed lessons, missions, achievements, and XP are stored against your account so you can pick up where
        you left off. This data is not shared with other users or third parties.
      </p>

      <h2>Browser storage</h2>
      <p>
        Before you sign in, and for any device-specific preferences (like terminal font size), Terminal Space uses
        your browser's local storage. This data stays on your device and is cleared if you clear your browser's site
        data.
      </p>

      <h2>Analytics</h2>
      <p>Terminal Space does not currently use any third-party analytics or advertising services.</p>

      <h2>Contact submissions</h2>
      <p>
        Messages sent through the contact form (name, email, and message) are stored so we can respond to them. They
        are not used for marketing.
      </p>

      <h2>Deletion requests</h2>
      <p>
        You can reset your learning progress from Settings at any time. For full account deletion, contact us — see
        the <Link to="/contact">contact page</Link>.
      </p>
    </section>
  );
}
