interface NICInfo {
  valid: boolean;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  format?: 'old' | 'new';
}

export function validateNIC(nic: string): NICInfo {
  if (!nic) return { valid: false };

  // Old format: 9 digits + V or X (e.g., 901234567V)
  const oldFormat = /^(\d{2})(\d{3})\d{4}[VvXx]$/;
  // New format: 12 digits (e.g., 200012345678)
  const newFormat = /^(\d{4})(\d{3})\d{5}$/;

  let year: number;
  let dayOfYear: number;

  const oldMatch = nic.match(oldFormat);
  const newMatch = nic.match(newFormat);

  if (oldMatch) {
    year = parseInt(oldMatch[1], 10) + 1900;
    dayOfYear = parseInt(oldMatch[2], 10);
    return {
      valid: true,
      dateOfBirth: getDOBFromDayOfYear(year, dayOfYear),
      gender: dayOfYear > 500 ? 'female' : 'male',
      format: 'old',
    };
  }

  if (newMatch) {
    year = parseInt(newMatch[1], 10);
    dayOfYear = parseInt(newMatch[2], 10);
    return {
      valid: true,
      dateOfBirth: getDOBFromDayOfYear(year, dayOfYear),
      gender: dayOfYear > 500 ? 'female' : 'male',
      format: 'new',
    };
  }

  return { valid: false };
}

function getDOBFromDayOfYear(year: number, dayOfYear: number): Date {
  // Female NICs have 500 added to the day
  if (dayOfYear > 500) dayOfYear -= 500;

  const date = new Date(year, 0, 1);
  date.setDate(dayOfYear);
  return date;
}

export function extractDOBFromNIC(nic: string): Date | null {
  const info = validateNIC(nic);
  return info.dateOfBirth || null;
}

export function isOver21(nic: string): boolean {
  const dob = extractDOBFromNIC(nic);
  if (!dob) return false;

  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 21;
  }
  return age >= 21;
}
