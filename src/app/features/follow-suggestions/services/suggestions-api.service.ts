import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetFollowSuggestionsRES } from '../interfaces/suggestions.interface';
import { HttpClient } from '@angular/common/http';
import { FollowSuggestionsEndPoints } from '../constants/follow-suggestions-endpoints';

@Service()
export class SuggestionsApiService {
  private readonly httpClient = inject(HttpClient);

  getFollowSuggestions(): Observable<IGetFollowSuggestionsRES> {
    return this.httpClient.get<IGetFollowSuggestionsRES>(
      FollowSuggestionsEndPoints.GetFollowSuggestions(),
    );
  }
}
