import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-post-loading',
  template: `
    <div
      class="w-full p-8 border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl dark:shadow-black/30 rounded-xl text-center text-slate-500 dark:text-slate-400"
    >
      Loading post...
    </div>
  `,
})
export class PostLoadingComponent {}
