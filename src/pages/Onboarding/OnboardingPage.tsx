import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field } from '../../components/UI/Primitives';
import { FILES_TRACK, trackLessons } from '../../data/tracks';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { usePageTitle } from '../../hooks/usePageTitle';

export function OnboardingPage() {
  const { t, bi } = usePreferences();
  usePageTitle(bi({ en: 'Welcome', ar: 'مرحباً' }));
  const { isConfigured, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const firstLesson = trackLessons(FILES_TRACK)[0];

  async function finish(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    if (isConfigured) {
      await updateProfile({ display_name: name.trim() || null, onboarding_complete: true });
    }
    setSubmitting(false);
    navigate(firstLesson ? `/app/lab/files/${firstLesson.id}` : '/app/learn/files');
  }

  if (step === 0) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="kicker">{bi({ en: 'Welcome', ar: 'مرحباً' })}</p>
          <h1>{bi({ en: 'Welcome to Terminal Space', ar: 'مرحباً في تيرمنال سبيس' })}</h1>
          <p className="lede">
            {bi({
              en: 'Learn terminal skills by actually using a simulated computer. No installation, and nothing you do here touches your real machine.',
              ar: 'تعلّم مهارات الطرفية باستخدام حاسوب محاكى. بلا تثبيت، ولا شيء مما تفعله هنا يمس جهازك الحقيقي.',
            })}
          </p>
          <div className="cta-row">
            <button type="button" className="btn-primary" onClick={() => setStep(1)}>
              {t('continue')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="kicker">{bi({ en: 'Start with Files', ar: 'ابدأ بمسار الملفات' })}</p>
        <h1>{bi({ en: 'Files teaches the foundations', ar: 'مسار الملفات يعلّم الأساسيات' })}</h1>
        <p className="lede">
          {bi({
            en: 'Navigation, directories, files, copying, moving, deleting — the everyday commands.',
            ar: 'التنقل، المجلدات، الملفات، النسخ، النقل، الحذف — أوامر العمل اليومي.',
          })}
        </p>
        {!isConfigured && <p className="auth-note">{t('notConnected')}</p>}
        <form className="auth-form" onSubmit={finish} noValidate>
          <Field
            id="onboarding-name"
            label={bi({ en: 'What should we call you? (optional)', ar: 'ماذا نناديك؟ (اختياري)' })}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="nickname"
          />
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? t('loading') : bi({ en: 'Start Files', ar: 'ابدأ الملفات' })}
          </button>
        </form>
      </div>
    </section>
  );
}
