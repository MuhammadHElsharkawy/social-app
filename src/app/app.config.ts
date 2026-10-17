import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './core/services/language/language.service';
import { FIELD_ERROR_MESSAGES } from 'reusable-components';
import { FieldErrorMessages } from 'reusable-components';

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
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideAppInitializer(() => inject(LanguageService).initialize()),
    {
      provide: FIELD_ERROR_MESSAGES,
      useFactory: (): FieldErrorMessages => {
        const translate = inject(TranslateService);

        return {
          required: (_e, label) =>
            translate.instant('COMMON.VALIDATION.REQUIRED', { field: label || 'This field' }),
          email: (_e, label) =>
            translate.instant('COMMON.VALIDATION.EMAIL', { field: label || 'email' }),
          minlength: (e, label) =>
            translate.instant('COMMON.VALIDATION.MIN_LENGTH', {
              field: label || 'This field',
              requiredLength: e.requiredLength,
              actualLength: e.actualLength,
            }),
          pattern: (_e, label) => translate.instant('COMMON.VALIDATION.PATTERN', { field: label }),
        };
      },
    },
  ],
};
