// Sri Lankan phone number validation
// Valid formats: 07XXXXXXXX, +947XXXXXXXX, 947XXXXXXXX
const SL_PHONE_REGEX = /^(?:\+?94|0)7[0-9]{8}$/;

export function validateSLPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return SL_PHONE_REGEX.test(cleaned);
}

export function formatSLPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');

  if (cleaned.startsWith('+94')) return cleaned;
  if (cleaned.startsWith('94')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+94${cleaned.slice(1)}`;

  return `+94${cleaned}`;
}

export function formatDisplayPhone(phone: string): string {
  const formatted = formatSLPhone(phone);
  // +94 77 123 4567
  return `${formatted.slice(0, 3)} ${formatted.slice(3, 5)} ${formatted.slice(5, 8)} ${formatted.slice(8)}`;
}
