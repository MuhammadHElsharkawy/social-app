import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ILike } from '../../../features/post/interfaces/like.interface';
import { IPost } from '../../../features/post/interfaces/post.interfaces';
import {
  LucideEarth,
  LucideEllipsis,
  LucideMessageCircle,
  LucideRepeat2,
  LucideShare2,
  LucideThumbsUp,
} from '@lucide/angular';
import { PostLikesComponent } from '../post-likes/post-likes.component';
import { PostTopCommentComponent } from '../post-top-comment/post-top-comment.component';

@Component({
  selector: 'app-post-card',
  imports: [
    LucideEarth,
    LucideEllipsis,
    LucideThumbsUp,
    LucideRepeat2,
    LucideMessageCircle,
    LucideShare2,
    PostLikesComponent,
    PostTopCommentComponent,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  private readonly authService = inject(AuthService);

  post = input.required<IPost>();
  postLikes = input.required<ILike[]>();
  postLikesLoading = input<boolean>();

  openPostLikes = signal<boolean>(false);

  onLike = output<string>();
  onLikesCount = output<string>();
  onComment = output<string>();
  onCommentsCount = output<string>();

  handleLikeClick(): void {
    this.onLike.emit(this.post()._id);
  }
  handleLikesCountClick(): void {
    if (this.post().likesCount > 0) {
      this.openPostLikes.set(true);
      this.onLikesCount.emit(this.post()._id);
    }
  }
  handleCommentClick(): void {
    this.onComment.emit(this.post()._id);
  }
  handleCommentsCountClick(): void {
    this.onCommentsCount.emit(this.post()._id);
  }

  likeClasses = computed(() =>
    this.post().likes.includes(this.authService.getUserId())
      ? 'bg-[#e7f3ff] text-[#1877f2] dark:bg-blue-950/60 dark:text-blue-400'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
  );
}
