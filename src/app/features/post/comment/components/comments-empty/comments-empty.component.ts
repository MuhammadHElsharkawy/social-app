import { Component } from '@angular/core';
import { LucideMessageCircle } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [LucideMessageCircle, TranslatePipe],
  selector: 'app-comments-empty',
  template: `
    <div
      class="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        class="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3ff] text-[#1877f2] dark:bg-blue-950/80 dark:text-blue-400 dark:ring-1 dark:ring-blue-900/50"
      >
        <svg lucideMessageCircle class="size-5.5"></svg>
      </div>

      <p class="text-lg font-extrabold text-slate-800 dark:text-slate-100">
        {{ 'POSTS.POST_COMMENTS.EMPTY_TITLE' | translate }}
      </p>
      <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
        {{ 'POSTS.POST_COMMENTS.EMPTY_DESC' | translate }}
      </p>
    </div>
  `,
})
export class CommentsEmptyComponent {}
