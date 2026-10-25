import { Component, inject, input, signal } from '@angular/core';
import {
  LucideHouse,
  LucideMenu,
  LucideMessageCircle,
  LucideSettings,
  LucideUser,
} from '@lucide/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { IUser } from '../../../core/interfaces/user.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-header',
  imports: [
    LucideHouse,
    LucideUser,
    LucideMessageCircle,
    LucideMenu,
    LucideSettings,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    OverlayModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  myData = input<IUser | null>();
  unreadNotificationsCount = input<number>(0);

  isOpen = signal<boolean>(false);

  handleProfileClick(): void {
    this.isOpen.set(false);
    this.router.navigate(['/profile']);
  }

  handleSettingsClick(): void {
    this.isOpen.set(false);
    this.router.navigate(['/settings']);
  }

  handleLogoutClick(): void {
    this.isOpen.set(false);
    this.authService.logOut();
  }

  openDropdown(): void {
    this.isOpen.set(true);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  toggleDropdown(): void {
    this.isOpen.update((prev) => !prev);
  }
}
