import { DestroyRef, inject, Service, signal } from '@angular/core';
import { ProfileApiService } from './profile-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { IProfileView } from '../interfaces/profile.interface';
import { UserApiService } from '../../../core/services/user/user-api.service';
import { toast } from 'ngx-sonner';
import { IToggleFollowUserData } from '../../../core/interfaces/user.interface';

@Service()
export class ProfileFacadeService {
  private readonly profileApiService = inject(ProfileApiService);
  private readonly userApiService = inject(UserApiService);
  private readonly destroyRef = inject(DestroyRef);

  private _profileState = signal<IProfileView | null>(null);
  public profile = this._profileState.asReadonly();

  private _getProfileLoadingState = signal<boolean>(false);
  public getProfileLoading = this._getProfileLoadingState.asReadonly();

  private _toggleFollowUserLoadingState = signal<boolean>(false);
  public toggleFollowUserLoading = this._toggleFollowUserLoadingState.asReadonly();

  getMyProfile(): void {
    this._getProfileLoadingState.set(true);

    this.profileApiService
      .getMyProfile()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getProfileLoadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this._profileState.set({
            user: res.data.user,
            isMyProfile: true,
            isFollowing: false,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getUserProfile(userId: string): void {
    this._getProfileLoadingState.set(true);

    this.profileApiService
      .getUserProfile(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getProfileLoadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this._profileState.set({
            user: res.data.user,
            isFollowing: res.data.isFollowing,
            isMyProfile: false,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private updateFollowingState(newState: IToggleFollowUserData): void {
    this._profileState.update((current) => {
      if (!current) return null;

      return {
        ...current,
        isFollowing: newState.following,
        user: { ...current.user, followersCount: newState.followersCount },
      };
    });
  }

  toggleFollowUser(userId: string): void {
    this._toggleFollowUserLoadingState.set(true);

    this.userApiService
      .toggleFollowUser(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._toggleFollowUserLoadingState.set(false)),
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
