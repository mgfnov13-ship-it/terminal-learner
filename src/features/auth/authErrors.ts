import type { LocalizedText } from '../../lib/i18n';

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'already_registered'
  | 'email_not_confirmed'
  | 'rate_limited'
  | 'network'
  | 'weak_password'
  | 'not_connected'
  | 'not_signed_in'
  | 'unknown';

const COPY: Record<AuthErrorCode, LocalizedText> = {
  invalid_credentials: {
    en: 'We couldn’t log you in. Check your email and password, then try again.',
    ar: 'تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور ثم أعد المحاولة.',
  },
  already_registered: {
    en: 'That email is already registered. Try signing in instead.',
    ar: 'هذا البريد مسجّل مسبقاً. جرّب تسجيل الدخول.',
  },
  email_not_confirmed: {
    en: 'Verify your email before signing in.',
    ar: 'أكّد بريدك الإلكتروني قبل تسجيل الدخول.',
  },
  rate_limited: {
    en: 'Too many attempts. Wait a moment and try again.',
    ar: 'محاولات كثيرة. انتظر لحظة ثم أعد المحاولة.',
  },
  network: {
    en: "We couldn't connect right now. Try again.",
    ar: 'تعذر الاتصال الآن. أعد المحاولة.',
  },
  weak_password: {
    en: 'Password must be at least 8 characters.',
    ar: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.',
  },
  not_connected: {
    en: "Terminal Space isn't connected to an account backend yet.",
    ar: 'تيرمنال سبيس غير متصل بخدمة حسابات بعد.',
  },
  not_signed_in: {
    en: 'Not signed in.',
    ar: 'لست مسجّلاً للدخول.',
  },
  unknown: {
    en: 'Something went wrong. Try again.',
    ar: 'حدث خطأ. أعد المحاولة.',
  },
};

export function classifyAuthMessage(message: string | undefined): AuthErrorCode {
  if (!message) return 'unknown';
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials') || m.includes('invalid_credentials')) return 'invalid_credentials';
  if (m.includes('already registered') || m.includes('already exists') || m.includes('user already')) {
    return 'already_registered';
  }
  if (m.includes('email not confirmed') || m.includes('email_not_confirmed')) return 'email_not_confirmed';
  if (m.includes('rate limit') || m.includes('over_request')) return 'rate_limited';
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to fetch')) return 'network';
  if (m.includes('password') && m.includes('at least')) return 'weak_password';
  return 'unknown';
}

/** Closed map: never echo the SDK string. */
export function authErrorCopy(message: string | undefined): LocalizedText {
  return COPY[classifyAuthMessage(message)];
}

export function authErrorCodeCopy(code: AuthErrorCode): LocalizedText {
  return COPY[code];
}
