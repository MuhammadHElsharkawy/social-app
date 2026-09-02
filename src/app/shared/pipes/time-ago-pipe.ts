import { inject, Pipe, PipeTransform } from '@angular/core';
import { DateService } from '../services/date.service';
import { DateInput } from '../utils/date.utils';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  private readonly dateService = inject(DateService);

  transform(value: DateInput | null | undefined, fallbackDays?: number): string {
    if (!value) return '';
    return this.dateService.timeAgo(value, fallbackDays);
  }
}
