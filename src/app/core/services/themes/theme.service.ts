import { afterRenderEffect, computed, inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { THEME_STORAGE_KEY } from '../../constants/storage-keys';

export type Theme = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';

@Service()
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly mode = signal<ThemeMode>('system');
  private readonly systemDark = signal<boolean>(false);

  readonly theme = computed<Theme>(() => {
    const currentMode = this.mode();
    if (currentMode === 'system') {
      return this.systemDark() ? 'dark' : 'light';
    }
    return currentMode;
  });

  readonly isDarkMode = () => this.theme() === 'dark';

  constructor() {
    if (this.isBrowser) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(media.matches);

      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      this.mode.set(saved ?? 'system');

      media.addEventListener('change', (e) => {
        this.systemDark.set(e.matches);
      });
    }

    afterRenderEffect(() => {
      if (!this.isBrowser) {
        return;
      }
      const current = this.theme();
      document.documentElement.classList.toggle('dark', current === 'dark');
      document.documentElement.style.colorScheme = current;
    });
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setMode(nextTheme);
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    if (this.isBrowser) {
      if (mode === 'system') {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
      }
    }
  }
}
