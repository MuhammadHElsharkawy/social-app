import { afterRenderEffect, inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Service()
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private media: MediaQueryList | null = null;

  readonly theme = signal<Theme>('light');
  readonly isDarkMode = () => this.theme() === 'dark';

  constructor() {
    if (this.isBrowser) {
      this.media = window.matchMedia('(prefers-color-scheme: dark)');
      const saved = localStorage.getItem('theme') as Theme | null;

      this.theme.set(saved ?? (this.media.matches ? 'dark' : 'light'));

      // Follow OS changes only if the user hasn't explicitly chosen
      this.media.addEventListener('change', (event) => {
        if (!localStorage.getItem('theme')) {
          this.theme.set(event.matches ? 'dark' : 'light');
        }
      });
    }

    afterRenderEffect(() => {
      if (!this.isBrowser) {
        return;
      }
      const current = this.theme();
      document.documentElement.classList.toggle('dark', current === 'dark');
      document.documentElement.style.colorScheme = current;
      localStorage.setItem('theme', current);
    });
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    this.theme.set(theme);
  }

  useSystemPreference(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem('theme');
    this.theme.set(this.media?.matches ? 'dark' : 'light');
  }
}
