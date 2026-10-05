import { Component, inject, OnInit } from '@angular/core';
import { LucideSearch, LucideUsers } from '@lucide/angular';
import { FollowSuggestionCardComponent } from '../../components/follow-suggestion-card/follow-suggestion-card.component';
import { FollowSuggestionLoadingComponent } from '../../components/follow-suggestion-loading/follow-suggestion-loading.component';
import { SuggestionsFacadeService } from '../../services/suggestions-facade.service';
import { UserFacadeService } from '../../../../core/services/user/user-facade.service';

@Component({
  imports: [
    LucideUsers,
    LucideSearch,
    FollowSuggestionCardComponent,
    FollowSuggestionLoadingComponent,
  ],
  selector: 'app-follow-suggestions',
  styleUrl: './follow-suggestions.component.css',
  templateUrl: './follow-suggestions.component.html',
})
export class FollowSuggestionsComponent implements OnInit {
  protected readonly suggestionsFacade = inject(SuggestionsFacadeService);
  protected readonly userFacade = inject(UserFacadeService);

  onFollowClick(userId: string): void {
    this.userFacade.toggleFollowUser(userId);
  }

  ngOnInit(): void {
    this.suggestionsFacade.getFollowSuggestions();
  }
}
