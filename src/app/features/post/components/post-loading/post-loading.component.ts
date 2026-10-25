import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe],
  selector: 'app-post-loading',
  template: `
    <div
      class="w-full p-8 border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl dark:shadow-black/30 rounded-xl text-center text-slate-500 dark:text-slate-400"
    >
      {{ 'COMMON.MESSAGES.LOADING_POSTS' | translate }}
    </div>
  `,
})
export class PostLoadingComponent {}
