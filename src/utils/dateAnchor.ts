/**
 * Temporal Anchoring Utility
 * Resolves relative date phrases (e.g. "tonight", "tomorrow", "by Tuesday", "in 2 days")
 * anchored to the specific meeting date.
 */

const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function parseBaseDate(baseDateStr: string): Date {
  if (!baseDateStr) return new Date('2026-11-01T12:00:00');
  // Avoid timezone skew by appending noon time if only date is given
  const normalized = baseDateStr.includes('T') ? baseDateStr : `${baseDateStr}T12:00:00`;
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? new Date('2026-11-01T12:00:00') : d;
}

export function formatHumanDate(date: Date): string {
  const m = MONTH_NAMES[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function resolveRelativeDeadline(
  phrase: string | undefined,
  baseDateStr: string
): { formatted: string; iso: string; relativeBadge: string } {
  const base = parseBaseDate(baseDateStr);
  if (!phrase) {
    const defaultDate = new Date(base);
    defaultDate.setDate(defaultDate.getDate() + 3);
    return {
      formatted: formatHumanDate(defaultDate),
      iso: formatISODate(defaultDate),
      relativeBadge: 'In 3 days',
    };
  }

  const clean = phrase.toLowerCase().trim();

  // Check explicit date like "Nov 5" or "11/5"
  const novMatch = clean.match(/nov(?:ember)?\s+(\d{1,2})/i);
  if (novMatch) {
    const day = parseInt(novMatch[1], 10);
    const target = new Date(base.getFullYear(), 10, day, 12, 0, 0);
    const diffDays = Math.round((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    return {
      formatted: formatHumanDate(target),
      iso: formatISODate(target),
      relativeBadge: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`,
    };
  }

  // Today / Tonight / EOD
  if (clean.includes('tonight') || clean.includes('today') || clean.includes('end of day') || clean.includes('eod')) {
    return {
      formatted: formatHumanDate(base),
      iso: formatISODate(base),
      relativeBadge: 'Tonight',
    };
  }

  // Tomorrow
  if (clean.includes('tomorrow')) {
    const target = new Date(base);
    target.setDate(target.getDate() + 1);
    return {
      formatted: formatHumanDate(target),
      iso: formatISODate(target),
      relativeBadge: 'Tomorrow',
    };
  }

  // In N days
  const inDaysMatch = clean.match(/in\s+(\d+|two|three|four|five)\s+days?/i);
  if (inDaysMatch) {
    const wordMap: Record<string, number> = { two: 2, three: 3, four: 4, five: 5 };
    const num = wordMap[inDaysMatch[1]] || parseInt(inDaysMatch[1], 10) || 2;
    const target = new Date(base);
    target.setDate(target.getDate() + num);
    return {
      formatted: formatHumanDate(target),
      iso: formatISODate(target),
      relativeBadge: `In ${num} days`,
    };
  }

  // Day of week match (e.g., "by Tuesday", "by Friday")
  for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
    const dayName = DAYS_OF_WEEK[i];
    if (clean.includes(dayName)) {
      const currentDayOfWeek = base.getDay();
      let diff = i - currentDayOfWeek;
      if (diff <= 0) diff += 7; // strictly upcoming
      const target = new Date(base);
      target.setDate(target.getDate() + diff);
      const capDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      return {
        formatted: formatHumanDate(target),
        iso: formatISODate(target),
        relativeBadge: `This ${capDay} (in ${diff}d)`,
      };
    }
  }

  // End of week -> Friday
  if (clean.includes('end of week') || clean.includes('eow')) {
    const currentDay = base.getDay();
    let diff = 5 - currentDay; // 5 is Friday
    if (diff <= 0) diff += 7;
    const target = new Date(base);
    target.setDate(target.getDate() + diff);
    return {
      formatted: formatHumanDate(target),
      iso: formatISODate(target),
      relativeBadge: `Friday (in ${diff}d)`,
    };
  }

  // Next week / Next Monday
  if (clean.includes('next week') || clean.includes('next monday')) {
    const currentDay = base.getDay();
    let diff = 1 - currentDay; // 1 is Monday
    if (diff <= 0) diff += 7;
    const target = new Date(base);
    target.setDate(target.getDate() + diff);
    return {
      formatted: formatHumanDate(target),
      iso: formatISODate(target),
      relativeBadge: `Next Mon (in ${diff}d)`,
    };
  }

  // Fallback: 3 days from base
  const fallback = new Date(base);
  fallback.setDate(fallback.getDate() + 3);
  return {
    formatted: formatHumanDate(fallback),
    iso: formatISODate(fallback),
    relativeBadge: 'In 3 days',
  };
}
