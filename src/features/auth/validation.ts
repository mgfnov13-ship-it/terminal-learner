import type { LocalizedText } from '../../lib/i18n';

export type ValidationCode =
  | 'email_required'
  | 'email_invalid'
  | 'password_required'
  | 'password_short'
  | 'confirm_required'
  | 'confirm_mismatch';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): ValidationCode | null {
  if (!value.trim()) return 'email_required';
  if (!EMAIL_RE.test(value.trim())) return 'email_invalid';
  return null;
}

export function validatePassword(value: string): ValidationCode | null {
  if (!value) return 'password_required';
  if (value.length < 8) return 'password_short';
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): ValidationCode | null {
  if (!confirm) return 'confirm_required';
  if (confirm !== password) return 'confirm_mismatch';
  return null;
}

export const VALIDATION_COPY: Record<ValidationCode, LocalizedText> = {
  email_required: { en: 'Enter your email.', ar: 'أدخل بريدك الإلكتروني.' },
  email_invalid: { en: 'Enter a valid email address.', ar: 'أدخل بريداً إلكترونياً صالحاً.' },
  password_required: { en: 'Enter a password.', ar: 'أدخل كلمة المرور.' },
  password_short: {
    en: 'Password must be at least 8 characters.',
    ar: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.',
  },
  confirm_required: { en: 'Confirm your password.', ar: 'أكّد كلمة المرور.' },
  confirm_mismatch: { en: 'Passwords do not match.', ar: 'كلمتا المرور غير متطابقتين.' },
};
