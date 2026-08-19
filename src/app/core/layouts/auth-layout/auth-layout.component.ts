import { Component } from '@angular/core';
import { FeaturesPanelComponent } from "../../../features/auth/components/features-panel/features-panel.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../features/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-auth-layout',
  imports: [FeaturesPanelComponent, RouterOutlet, RouterLink, RouterLinkActive, ThemeSwitcherComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
