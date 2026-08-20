import { Component, input, output } from '@angular/core';
import { LucideUsers, LucideX } from '@lucide/angular';
import { ILike } from '../../../features/post/interfaces/like.interface';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { PostLikeCardComponent } from "../post-like-card/post-like-card.component";

@Component({
  selector: 'app-post-likes',
  imports: [LucideUsers, LucideX, ClickOutsideDirective, PostLikeCardComponent],
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
