import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetMyProfileRES, IGetUserProfileRES } from '../interfaces/profile.interface';
import { UserEndPoints } from '../constants/user-endpoints';

@Service()
export class ProfileApiService {
  private readonly httpClient = inject(HttpClient);

  getMyProfile(): Observable<IGetMyProfileRES> {
    return this.httpClient.get<IGetMyProfileRES>(UserEndPoints.GetMyProfile);
  }

  getUserProfile(userId: string): Observable<IGetUserProfileRES> {
    return this.httpClient.get<IGetUserProfileRES>(UserEndPoints.GetUserProfile(userId));
  }
}
