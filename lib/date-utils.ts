import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears, 
  isWeekend, 
  nextDay, 
  setDay, 
  startOfMonth, 
  endOfMonth,
  isAfter,
  parseISO,
  format,
  getDate,
  setDate,
  lastDayOfMonth
} from 'date-fns';
import { Frequency, RecurringMetadata } from './types';

export function getNextOccurrence(
  currentDate: string | Date, 
  frequency: Frequency, 
  metadata?: RecurringMetadata,
  endDate?: string
): string | null {
  const date = typeof currentDate === 'string' ? parseISO(currentDate) : currentDate;
  let next: Date;

  switch (frequency) {
    case 'daily':
      next = addDays(date, 1);
      break;
    case 'weekday':
      next = addDays(date, 1);
      while (isWeekend(next)) {
        next = addDays(next, 1);
      }
      break;
    case 'weekly':
      next = addWeeks(date, 1);
      break;
    case 'monthly':
      // Handle end of month: if we are on the 31st and next month has 30 days, go to 30th.
      const dayOfMonth = getDate(date);
      const nextMonth = addMonths(date, 1);
      const lastDayOfNextMonth = lastDayOfMonth(nextMonth);
      if (dayOfMonth > getDate(lastDayOfNextMonth)) {
        next = lastDayOfNextMonth;
      } else {
        next = setDate(nextMonth, dayOfMonth);
      }
      break;
    case 'yearly':
      next = addYears(date, 1);
      break;
    case 'custom':
      if (!metadata) {
        next = addDays(date, 1); // Fallback
      } else if (metadata.dayOfWeek !== undefined && metadata.weekOfMonth !== undefined) {
        // e.g. First Monday of the month
        const nextMonthStart = startOfMonth(addMonths(date, 1));
        let candidate = setDay(nextMonthStart, metadata.dayOfWeek, { weekStartsOn: 0 });
        if (isAfter(nextMonthStart, candidate)) {
          candidate = addWeeks(candidate, 1);
        }
        next = addWeeks(candidate, metadata.weekOfMonth - 1);
      } else if (metadata.dayOfWeek !== undefined) {
        // e.g. Every Tuesday
        next = addWeeks(date, 1);
        next = setDay(next, metadata.dayOfWeek, { weekStartsOn: 0 });
      } else if (metadata.dayOfMonth !== undefined) {
        // e.g. 15th of every month
        const nextMonth = addMonths(date, 1);
        const lastDay = lastDayOfMonth(nextMonth);
        next = setDate(nextMonth, Math.min(metadata.dayOfMonth, getDate(lastDay)));
      } else {
        next = addDays(date, 1);
      }
      break;
    default:
      next = addDays(date, 1);
  }

  const result = format(next, 'yyyy-MM-dd');
  
  if (endDate && isAfter(next, parseISO(endDate))) {
    return null;
  }

  return result;
}
