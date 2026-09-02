import { inject, Pipe, PipeTransform } from '@angular/core';
import { DateService } from '../services/date.service';
import { DateInput, DateFormatPreset } from '../utils/date.utils';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  private readonly dateService = inject(DateService);

  transform(
    value: DateInput | null | undefined,
    format: DateFormatPreset | Intl.DateTimeFormatOptions = 'short'
  ): string {
    if (!value) return '';
    return this.dateService.format(value, format);
  }
}
