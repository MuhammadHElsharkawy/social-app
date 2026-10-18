import { Component, input, output } from '@angular/core';
import { LucideUsers, LucideX } from '@lucide/angular';
import { PostLikeCardComponent } from "../post-like-card/post-like-card.component";
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { ILike } from '../../interfaces/like.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-post-likes',
  imports: [LucideUsers, LucideX, ClickOutsideDirective, PostLikeCardComponent, TranslatePipe],
  templateUrl: './post-likes.component.html',
  styleUrl: './post-likes.component.css',
})
export class PostLikesComponent {
  postLikes = input.required<ILike[]>();
  postLikesLoading = input<boolean>();

  closePostLikes = output<void>();

  handleCloseClick(): void {
    this.closePostLikes.emit();
  }
}
