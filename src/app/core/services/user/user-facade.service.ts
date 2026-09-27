import { DestroyRef, inject, Service, signal } from '@angular/core';
import { IToggleFollowUserData, IUser } from '../../interfaces/user.interface';
import { UserApiService } from './user-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { toast } from 'ngx-sonner';

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

  changeProfilePicture(picture: File): void {
    this._changeProfilePictureLoadingState.set(true);

    const data: FormData = new FormData();
    data.append('photo', picture);

    this.UserApi.changeProfilePicture(data)
      .pipe(finalize(() => this._changeProfilePictureLoadingState.set(false)))
      .subscribe({
        next: (res) => {
          this.updateProfilePicture(res.data.photo);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  changeCoverPicture(cover: File): void {
    this._changeCoverPictureLoadingState.set(true);

    const data: FormData = new FormData();
    data.append('cover', cover);

    this.UserApi.changeCoverPicture(data)
      .pipe(finalize(() => this._changeCoverPictureLoadingState.set(false)))
      .subscribe({
        next: (res) => {
          this.updateCoverPicture(res.data.cover);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
