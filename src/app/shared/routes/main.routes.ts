import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('../../features/home/pages/home-page/home-page.component').then(
        (c) => c.HomePageComponent,
      ),
  },
  //   {
  //     path: 'profile',
  //     loadComponent: () =>
  //       import('../../features/profile/page/profile.component').then((c) => c.ProfileComponent),
  //   },
  //   {
  //     path: 'notifications',
  //     loadComponent: () =>
  //       import('../../features/notifications/page/notifications.component').then(
  //         (c) => c.NotificationsComponent,
  //       ),
  //   },
  //   {
  //     path: 'suggestions',
  //     loadComponent: () =>
  //       import('../../features/followSuggestions/pages/followsuggestions/follow-suggestions.component').then(
  //         (c) => c.FollowsuggestionsComponent,
  //       ),
  //   },
  //   {
  //     path: 'settings',
  //     loadComponent: () =>
  //       import('../../features/change-password/page/change-password.component').then(
  //         (c) => c.ChangePasswordComponent,
  //       ),
  //   },
];
