import { Component, inject } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ThemeService } from '../../core/services/themes/theme.service';

@Component({
  selector: 'app-theme-switcher',
  imports: [LucideSun, LucideMoon],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css',
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
}
