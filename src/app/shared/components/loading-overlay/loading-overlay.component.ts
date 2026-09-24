import { Component } from '@angular/core';
import { LucideLoaderCircle } from '@lucide/angular';

@Component({
  imports: [LucideLoaderCircle],
  selector: 'app-loading-overlay',
  template: `
    <div
      class="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] transition-all"
    >
      <div
        class="flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-lg ring-1 ring-black/5"
      >
        <svg lucideLoaderCircle class="size-5 animate-spin text-blue-500"></svg>

        <span class="text-sm font-medium text-slate-700">Refreshing your timeline...</span>
      </div>
    </div>
  `,
})
export class LoadingOverlayComponent {}
