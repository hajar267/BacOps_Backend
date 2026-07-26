export function getInitials(firstName?: string, lastName?: string): string {
  const first = (firstName ?? '').trim();
  const last = (lastName ?? '').trim();
  const initials = `${first.charAt(0)}${last.charAt(0)}`.trim();
  return initials ? initials.toUpperCase() : 'U';
}
