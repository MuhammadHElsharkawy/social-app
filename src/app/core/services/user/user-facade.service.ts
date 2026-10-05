import { DestroyRef, inject, Service, signal } from '@angular/core';
import { IToggleFollowUserData, IUser } from '../../interfaces/user.interface';
import { UserApiService } from './user-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { toast } from 'ngx-sonner';
import { IUpdateProfilePictureData } from '../../../features/profile/interfaces/profile.interface';

@Service()
export class UserFacadeService {
  private readonly UserApi = inject(UserApiService);
  private readonly destroyRef = inject(DestroyRef);

  private _userState = signal<IUser | null>(null);
  public user = this._userState.asReadonly();

  private _getUserLoadingState = signal<boolean>(false);
  public getUserLoading = this._getUserLoadingState.asReadonly();

  private _changeProfilePictureLoadingState = signal<boolean>(false);
  public changeProfilePictureLoading = this._changeProfilePictureLoadingState.asReadonly();

  private _changeCoverPictureLoadingState = signal<boolean>(false);
  public changeCoverPictureLoading = this._changeCoverPictureLoadingState.asReadonly();

  private _deleteCoverLoadingState = signal<boolean>(false);
  public deleteCoverLoading = this._deleteCoverLoadingState.asReadonly();

  private _toggleFollowUserLoadingState = signal<string | null>(null);
  public toggleFollowUserLoading = this._toggleFollowUserLoadingState.asReadonly();

  getUser(): void {
    this._getUserLoadingState.set(true);

    this.UserApi.getCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getUserLoadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this._userState.set(res.data.user);
        },
        error: (err) => {
          toast.error('Something went wrong!', { description: err.error.message });
        },
      });
  }

  private updateProfilePicture(newPicture: string): void {
    this._userState.update((current) => {
      if (!current) return null;

      return { ...current, photo: newPicture };
    });
  }

  private updateCoverPicture(newCover: string): void {
    this._userState.update((current) => {
      if (!current) return null;

      return { ...current, cover: newCover };
    });
  }

  private removeProfileCover(): void {
    this._userState.update((current) => {
      if (!current) return null;

      return { ...current, cover: undefined };
    });
  }

  changeProfilePicture(data: IUpdateProfilePictureData): void {
    this._changeProfilePictureLoadingState.set(true);

    const formData: FormData = new FormData();
    formData.append('photo', data.picture);
    formData.append('privacy', data.privacy);

    this.UserApi.changeProfilePicture(formData)
      .pipe(finalize(() => this._changeProfilePictureLoadingState.set(false)))
      .subscribe({
        next: (res) => {
          this.updateProfilePicture(res.data.photo);
        },
        error: (err) => {
          toast.error('Something went wrong!', {
            description: `${err.error.message}`,
          });
        },
      });
  }

  changeCoverPicture(data: IUpdateProfilePictureData): void {
    this._changeCoverPictureLoadingState.set(true);

    const formData: FormData = new FormData();
    formData.append('cover', data.picture);
    formData.append('privacy', data.privacy);

    this.UserApi.changeCoverPicture(formData)
      .pipe(finalize(() => this._changeCoverPictureLoadingState.set(false)))
      .subscribe({
        next: (res) => {
          this.updateCoverPicture(res.data.cover);
        },
        error: (err) => {
          toast.error('Something went wrong!', {
            description: `${err.error.message}`,
          });
        },
      });
  }

  deleteCover(): void {
    this._deleteCoverLoadingState.set(true);

    this.UserApi.deleteCover()
      .pipe(finalize(() => this._deleteCoverLoadingState.set(false)))
      .subscribe({
        next: () => {
          this.removeProfileCover();
        },
        error: (err) => {
          toast.error('Something went wrong!', {
            description: `${err.error.message}`,
          });
        },
      });
  }

  private updateFollowingState(newState: IToggleFollowUserData): void {
    this._userState.update((current) => {
      if (!current) return null;

      return { ...current, followersCount: newState.followersCount };
    });
  }

  toggleFollowUser(userId: string): void {
    this._toggleFollowUserLoadingState.set(userId);

    this.UserApi.toggleFollowUser(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._toggleFollowUserLoadingState.set(null)),
      )
      .subscribe({
        next: (res) => {
          this.updateFollowingState(res.data);
        },
        error: (err) => {
          toast.error('Something went wrong!', { description: err.error.message });
        },
      });
  }
}
