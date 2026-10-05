import { DestroyRef, inject, Service, signal } from '@angular/core';
import { SuggestionsApiService } from './suggestions-api.service';
import { IUser } from '../../../core/interfaces/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Service()
export class SuggestionsFacadeService {
  private readonly suggestionsApi = inject(SuggestionsApiService);
  private readonly destroyRef = inject(DestroyRef);

  private _suggestionsListState = signal<IUser[]>([]);
  public suggestionsList = this._suggestionsListState.asReadonly();

  private _getSuggestionsLoadingState = signal<boolean>(false);
  public getSuggestionsLoading = this._getSuggestionsLoadingState.asReadonly();

  getFollowSuggestions(): void {
    this._getSuggestionsLoadingState.set(true);

    this.suggestionsApi
      .getFollowSuggestions()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._getSuggestionsLoadingState.set(false)),
      )
      .subscribe({
        next: (res) => {
          this._suggestionsListState.set(res.data.suggestions);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
