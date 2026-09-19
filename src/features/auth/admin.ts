const ADMIN_EMAILS = new Set(['mgfnov13@gmail.com', 'm.obaida2021@gmail.com']);

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && ADMIN_EMAILS.has(email.trim().toLowerCase()));
}
