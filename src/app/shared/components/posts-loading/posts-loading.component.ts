import { Component } from '@angular/core';

@Component({
  selector: 'app-posts-loading',
  imports: [],
  template: `
    <div class="space-y-4">
      <!-- Skeleton Card 1 -->
      <div
        class="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl dark:shadow-black/30"
      >
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div class="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <div class="h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div class="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>

      <!-- Skeleton Card 2 -->
      <div
        class="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl dark:shadow-black/30"
      >
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div class="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <div class="h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div class="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  `,
})
export class PostsLoadingComponent {}
