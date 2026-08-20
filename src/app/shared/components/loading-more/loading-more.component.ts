import { Component } from '@angular/core';
import { LucideLoaderCircle } from '@lucide/angular';

@Component({
  selector: 'app-loading-more',
  imports: [LucideLoaderCircle],
  template: `
    <div class="flex justify-center">
      <div
        class="bg-white dark:bg-slate-900 rounded-full text-sm text-slate-500 dark:text-slate-400 inline-flex items-center gap-2 py-1.5 px-3 shadow-sm"
      >
        <svg
          lucideLoaderCircle
          class="animate-spin size-4.5 text-slate-500 dark:text-slate-400"
        ></svg>
        <span>Loading more posts...</span>
      </div>
    </div>
  `,
})
export class LoadingMoreComponent {}
