import { Routes } from '@angular/router';
import { TestComponent } from './features/test/test.component';

export const routes: Routes = [
    {
    path: '',
    // canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.routes),
  },
  {
    path: 'home', component: TestComponent
  }
//   {
//     path: '',
//     component: MainLayoutComponent,
//     canActivate: [authGuard],
//     loadChildren: () => import('./shared/routes/main.routes').then((r) => r.routes),
//   },
];
