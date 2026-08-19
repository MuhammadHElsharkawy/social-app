import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_STORAGE_KEY } from '../../../core/constants/storage-keys';
import { authEndPoints } from '../constants/auth-endpoints';
import { IDecodedToken } from '../../../core/interfaces/decoded-token.interface';
import { AuthResponse, LoginREQ, RegisterREQ } from '../interfaces/auth.interfaces';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(SsrCookieService);
  private readonly router = inject(Router);

  register(data: RegisterREQ): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(authEndPoints.REGISTER, data);
  }

  login(data: LoginREQ): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(authEndPoints.LOGIN, data);
  }

  logOut(): void {
    this.cookieService.delete(TOKEN_STORAGE_KEY);
    this.router.navigate(['/login']);
    this.isAuthenticated.set(false);
  }

  saveToken(token: string, expiresInDays: number = 90): void {
    this.cookieService.set(TOKEN_STORAGE_KEY, token, { expires: expiresInDays });
  }

  getToken(): string | null {
    return this.cookieService.get(TOKEN_STORAGE_KEY) || null;
  }

  getUserId(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<IDecodedToken>(token);
      return decoded.user;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  isAuthenticated = signal(this.cookieService.check(TOKEN_STORAGE_KEY));
}
