import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IChangeCoverPictureRES,
  IChangeProfilePictureRES,
  IDeleteCoverRES,
  IGetUserRES,
  IToggleFollowUserRES,
} from '../../interfaces/user.interface';
import { UserEndPoints } from '../../../features/profile/constants/user-endpoints';

@Service()
export class UserApiService {
  private readonly httpClient = inject(HttpClient);

  getCurrentUser(): Observable<IGetUserRES> {
    return this.httpClient.get<IGetUserRES>(UserEndPoints.GetMyProfile);
  }

  toggleFollowUser(userId: string): Observable<IToggleFollowUserRES> {
    return this.httpClient.put<IToggleFollowUserRES>(UserEndPoints.ToggleFollowUser(userId), {});
  }

  changeProfilePicture(picture: FormData): Observable<IChangeProfilePictureRES> {
    return this.httpClient.put<IChangeProfilePictureRES>(UserEndPoints.UploadProfilePhoto, picture);
  }

  changeCoverPicture(cover: FormData): Observable<IChangeCoverPictureRES> {
    return this.httpClient.put<IChangeCoverPictureRES>(UserEndPoints.UploadCoverPhoto, cover);
  }

  deleteCover(): Observable<IDeleteCoverRES> {
    return this.httpClient.delete<IDeleteCoverRES>(UserEndPoints.DeleteProfileCover);
  }
}
