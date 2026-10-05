import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-notification-loading',
  template: `
    <div
      class="animate-pulse rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl dark:shadow-black/30"
    >
      <div class="flex items-center gap-3">
        <div class="h-11 w-11 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        <div class="flex-1 space-y-2">
          <div class="h-2.5 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div class="h-2.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div class="h-2.5 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  `,
})
export class NotificationLoadingComponent {}
