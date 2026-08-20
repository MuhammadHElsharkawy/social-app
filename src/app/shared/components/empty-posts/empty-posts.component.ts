import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-posts',
  imports: [],
  template: `
    <div
  class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:shadow-xl dark:shadow-black/30"
>
  No posts yet. Be the first one to publish.
</div>
  `,
})
export class EmptyPostsComponent {}
