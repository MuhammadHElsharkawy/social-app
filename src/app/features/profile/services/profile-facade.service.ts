import { DestroyRef, inject, Service, signal } from '@angular/core';
import { ProfileApiService } from './profile-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUser } from '../../../core/interfaces/user.interface';
import { finalize } from 'rxjs';

@Service()
export class ProfileFacadeService {
  private readonly profileApiService = inject(ProfileApiService);
  private readonly destroyRef = inject(DestroyRef);

  private _myDataState = signal<IUser | null>(null);
  private _getMyDataLoadingState = signal<boolean>(false);

  public myData = this._myDataState.asReadonly();
  public getMyDataLoading = this._getMyDataLoadingState.asReadonly();

  getMyProfile(): void {
    this._getMyDataLoadingState.set(true);

    this.profileApiService
      .getMyProfile()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getMyDataLoadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this._myDataState.set(res.data.user);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
