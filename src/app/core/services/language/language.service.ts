import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type Language = 'en' | 'ar';

@Service()
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly storageKey = 'app-language';

  private readonly _currentLanguage = signal<Language>('en');
  readonly currentLanguage = this._currentLanguage.asReadonly();

  async initialize(): Promise<void> {
    const savedLanguage = isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.storageKey)
      : null;

    const language: Language = savedLanguage === 'ar' ? 'ar' : 'en';

    this.applyLanguageSettings(language);

    await firstValueFrom(this.translate.use(language));
  }

  async changeLanguage(language: Language): Promise<void> {
    if (language === this._currentLanguage()) {
      return;
    }

    this.applyLanguageSettings(language);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, language);
    }

    await firstValueFrom(this.translate.use(language));
  }

  private applyLanguageSettings(language: Language): void {
    this._currentLanguage.set(language);

    this.document.documentElement.lang = language;
    this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
}
