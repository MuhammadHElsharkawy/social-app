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
}
