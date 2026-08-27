import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ChangePasswordREQ, ChangePasswordRES } from '../interfaces/change-password.interface';
import { Observable } from 'rxjs';
import { SettingsEndPoints } from '../constants/settings-endpoints';

@Service()
export class ChangePasswordService {
  private readonly httpClient = inject(HttpClient);

  changePassword(data: ChangePasswordREQ): Observable<ChangePasswordRES> {
    return this.httpClient.patch<ChangePasswordRES>(SettingsEndPoints.ChangePassword, data);
  }
}
