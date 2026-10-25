import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];

  private excludedRoutes: string[] = ['/login', '/register'];

  constructor(
    private router: Router,
    private location: Location,
  ) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        if (!this.isExcluded(url)) {
          this.history.push(event.urlAfterRedirects);
        }
      });
  }

  private isExcluded(url: string): boolean {
    const cleanUrl = url.split('?')[0].split('#')[0];
    return this.excludedRoutes.some((excluded) => cleanUrl.startsWith(excluded));
  }

  back(fallbackUrl: string = '/'): void {
    this.history.pop();

    if (this.history.length > 0) {
      const previousUrl = this.history[this.history.length - 1];
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigateByUrl(fallbackUrl);
    }
  }
}
