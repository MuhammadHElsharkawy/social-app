import { Component, inject } from '@angular/core';
import { LucideMonitor, LucideMoon, LucideSun } from '@lucide/angular';
import { ThemeService } from '../../../core/services/themes/theme.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, Language } from '../../../core/services/language/language.service';
import { ChangePasswordComponent } from '../components/security-tab/change-password.component';

@Component({
  imports: [
    LucideSun,
    LucideMoon,
    LucideMonitor,
    // TranslatePipe,
    ChangePasswordComponent,
  ],
  selector: 'app-settings',
  styleUrl: './settings.component.css',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  protected readonly themeService = inject(ThemeService);
  protected languageService = inject(LanguageService);

  changeLanguage(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value as Language;
    this.languageService.changeLanguage(lang);
  }
}
