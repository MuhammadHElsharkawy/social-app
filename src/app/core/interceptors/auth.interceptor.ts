import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { authEndPoints } from '../../features/auth/constants/auth-endpoints';
import { AuthService } from '../../features/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getToken();

  const isAuthRequest =
    req.url.includes(authEndPoints.LOGIN) || req.url.includes(authEndPoints.REGISTER);
  let modifiedReq = req;

  if (token && !isAuthRequest) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Unauthorized request - session expired or invalid token.');
      }
      return throwError(() => error);
    }),
  );
};
