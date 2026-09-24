import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-empty-posts',
  imports: [],
  template: `
    <div [class]="classes()">
      {{ msg() }}
    </div>
  `,
})
export class EmptyPostsComponent {
  msg = input<string>('No posts yet. Be the first one to publish.');
  styleMode = input<'default' | 'profile'>('default');

  classes = computed(() =>
    this.styleMode() === 'default'
      ? 'rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:shadow-xl dark:shadow-black/30'
      : 'rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500',
  );
}
