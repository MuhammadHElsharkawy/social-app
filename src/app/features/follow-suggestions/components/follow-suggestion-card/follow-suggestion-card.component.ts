import { Component, input, output } from '@angular/core';
import { LucideLoaderCircle, LucideUserPlus } from '@lucide/angular';
import { IUser } from '../../../../core/interfaces/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [LucideUserPlus, LucideLoaderCircle, RouterLink],
  selector: 'app-follow-suggestion-card',
  styleUrl: './follow-suggestion-card.component.css',
  templateUrl: './follow-suggestion-card.component.html',
})
export class FollowSuggestionCardComponent {
  suggestion = input.required<IUser>();
  followLoading = input<boolean>(false);

  onFollow = output<string>();

  handleFollowClick(): void {
    this.onFollow.emit(this.suggestion()._id);
  }
}
