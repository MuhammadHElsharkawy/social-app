import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-error-message',
  imports: [],
  template: `
    @if (errorMessage()) {
      <div
        class="mt-3.5 border border-rose-200 bg-rose-50 text-center text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 "
        [class]="styleType() === 'auth' ? 'rounded-xl px-4 py-2.5' : 'px-3 py-2 rounded-lg'"
      >
        {{ errorMessage() || 'something went wrong, try again!' }}
      </div>
    }
  `,
})
export class FormErrorMessageComponent {
  errorMessage = input.required<string | null>();

  styleType = input<'auth' | 'change-password'>('auth');
}
