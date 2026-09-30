import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideClientHydration(
    //   // withHttpTransferCacheOptions({
    //   //   includePostRequests: false,
    //   //   includeRequestsWithAuthHeaders: true,
    //   // }),
    // ),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
