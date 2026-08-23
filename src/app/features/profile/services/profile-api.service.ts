import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetMyProfile } from '../interfaces/profile.interface';
import { UserEndPoints } from '../constants/user-endpoints';

@Service()
export class ProfileApiService {
  private readonly httpClient = inject(HttpClient);

  getMyProfile(): Observable<IGetMyProfile> {
    return this.httpClient.get<IGetMyProfile>(UserEndPoints.GetMyProfile);
  }
}
