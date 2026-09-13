const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Enter your email.';
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Enter a password.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return 'Confirm your password.';
  if (confirm !== password) return 'Passwords do not match.';
  return null;
}
