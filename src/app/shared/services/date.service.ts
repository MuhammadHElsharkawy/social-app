import { Service, signal } from '@angular/core';
import { DateInput, DateFormatPreset, formatDate, formatCompactTimeAgo } from '../utils/date.utils';

@Service()
export class DateService {
  readonly currentLocale = signal<string>('en-US');

  setLocale(locale: string): void {
    this.currentLocale.set(locale);
  }

  format(
    date: DateInput,
    format: DateFormatPreset | Intl.DateTimeFormatOptions = 'short'
  ): string {
    return formatDate(date, format, this.currentLocale());
  }

  timeAgo(date: DateInput, fallbackDaysThreshold?: number): string {
    return formatCompactTimeAgo(date, fallbackDaysThreshold);
  }
}