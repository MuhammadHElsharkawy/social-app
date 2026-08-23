import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  LucideHouse,
  LucideMenu,
  LucideMessageCircle,
  LucideSettings,
  LucideUser,
} from '@lucide/angular';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ThemeSwitcherComponent } from '../../../features/theme-switcher/theme-switcher.component';
import { IUser } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-header',
  imports: [
    LucideHouse,
    LucideUser,
    LucideMessageCircle,
    LucideMenu,
    LucideSettings,
    ClickOutsideDirective,
    RouterLink,
    RouterLinkActive,
    ThemeSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  myData = input<IUser | null>();

  isOpen = signal<boolean>(false);

  onSettingsClick(): void {
    this.isOpen.set(false);
    this.router.navigate(['/settings']);
  }

  toggleDropdown(): void {
    this.isOpen.update((prev) => !prev);
  }
}
