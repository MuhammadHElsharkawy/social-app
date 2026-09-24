import { Component, computed, input, output } from '@angular/core';
import { LucideLoaderCircle } from '@lucide/angular';

@Component({
  selector: 'app-posts-filter-btn',
  imports: [LucideLoaderCircle],
  templateUrl: './posts-filter-btn.component.html',
  styleUrl: './posts-filter-btn.component.css',
})
export class PostsFilterBtnComponent {
  label = input.required<string>();
  isActive = input<boolean>(false);
  isLoading = input<boolean>(false);
  styleMode = input<'default' | 'profile'>('default');

  buttonClasses = computed(() => {
    if (this.styleMode() === 'default') {
      if (this.isActive())
        return 'bg-[#e7f3ff] text-[#1877f2] dark:bg-blue-950/60 dark:text-blue-400 rounded-xl';
      else
        return 'rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 lg:bg-transparent lg:text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:dark:bg-transparent';
    }
    if (this.styleMode() === 'profile') {
      if (this.isActive()) return 'bg-white text-[#1877f2] shadow-sm rounded-lg';
      else
        return 'rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 lg:bg-transparent lg:text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:dark:bg-transparent';
    }
    return '';
  });

  btnClick = output<void>();

  handleClick() {
    if (this.isLoading()) return;
    this.btnClick.emit();
  }
}
