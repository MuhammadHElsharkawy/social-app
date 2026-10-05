import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-notifications-empty',
  template: `
    <div
      class="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/60"
    >
      <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ msg() }}</p>
    </div>
  `,
})
export class NotificationsEmptyComponent {
  msg = input<string>('No notifications yet.');
}
