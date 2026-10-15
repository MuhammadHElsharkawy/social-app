import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language/language.service';

@Component({
  imports: [],
  selector: 'app-language-switcher',
  styleUrl: './language-switcher.component.css',
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  private languageService = inject(LanguageService);

  changeLanguage(lang: 'en' | 'ar'): void {
    this.languageService.changeLanguage(lang);
  }
}
