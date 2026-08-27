import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-settings',
  styleUrl: './settings.component.css',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private router = inject(Router);
  activeTab = signal<'settings' | 'security'>('settings');

  constructor() {
    this.updateActiveTab(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveTab(event.urlAfterRedirects || event.url);
      });
  }

  private updateActiveTab(url: string) {
    if (url.includes('security')) {
      this.activeTab.set('security');
    } else {
      this.activeTab.set('settings');
    }
  }
}
