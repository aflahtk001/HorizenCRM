import { format, parseISO, isToday, isTomorrow, isPast, isThisWeek, isThisMonth } from 'date-fns';

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMM yyyy');
  } catch {
    return '—';
  }
}

export function formatDateShort(date: string | Date | undefined | null): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMM');
  } catch {
    return '—';
  }
}

export function formatTime(time: string | undefined | null): string {
  if (!time) return '—';
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } catch {
    return time;
  }
}

export function formatDateTime(date: string | undefined, time: string | undefined): string {
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);
  if (formattedDate === '—' && formattedTime === '—') return '—';
  if (formattedDate === '—') return formattedTime;
  if (formattedTime === '—') return formattedDate;
  return `${formattedDate} at ${formattedTime}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

export function getFollowUpStatus(followUpDate: string | undefined): 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'none' {
  if (!followUpDate) return 'none';
  try {
    const date = parseISO(followUpDate);
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    if (isPast(date)) return 'overdue';
    return 'upcoming';
  } catch {
    return 'none';
  }
}

export function getRelativeDate(date: string): string {
  try {
    const d = parseISO(date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d)) return `Overdue (${format(d, 'dd MMM')})`;
    if (isThisWeek(d)) return format(d, 'EEEE');
    return format(d, 'dd MMM yyyy');
  } catch {
    return date;
  }
}

export function truncate(text: string, maxLength: number = 80): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatCreatedAt(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMM yyyy, hh:mm a');
  } catch {
    return '—';
  }
}
