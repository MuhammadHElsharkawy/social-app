import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
    path: '',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.routes),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./shared/routes/main.routes').then((r) => r.routes),
  },
];
