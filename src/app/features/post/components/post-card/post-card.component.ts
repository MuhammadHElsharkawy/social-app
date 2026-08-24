import { Component, computed, inject, input, output, signal } from '@angular/core';
import {
  LucideBookmark,
  LucideEarth,
  LucideEllipsis,
  LucideMessageCircle,
  LucidePencil,
  LucideRepeat2,
  LucideShare2,
  LucideThumbsUp,
  LucideTrash2,
} from '@lucide/angular';
import { PostLikesComponent } from '../post-likes/post-likes.component';
import { PostTopCommentComponent } from '../post-top-comment/post-top-comment.component';
import { AuthService } from '../../../auth/services/auth.service';
import { IPost } from '../../interfaces/post.interfaces';
import { ILike } from '../../interfaces/like.interface';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';

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
    ClickOutsideDirective,
    LucideBookmark,
    LucidePencil,
    LucideTrash2,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  private readonly authService = inject(AuthService);

  post = input.required<IPost>();
  postLikes = input.required<ILike[]>();
  postLikesLoading = input<boolean>();

  savePostLoading = input<boolean>(false);

  openPostLikes = signal<boolean>(false);

  openOptions = signal<boolean>(false);
  isMyPost = computed<boolean>(() => this.authService.getUserId() === this.post().user._id);

  onLike = output<string>();
  onLikesCount = output<string>();

  onComment = output<string>();
  onCommentsCount = output<string>();

  onSave = output<string>();
  onEdit = output<string>();
  onDelete = output<string>();

  handleLikeClick(): void {
    this.onLike.emit(this.post()._id);
  }
  handleLikesCountClick(): void {
    if (this.post().likesCount > 0) {
      this.openPostLikes.set(true);
      this.onLikesCount.emit(this.post()._id);
    }
  }

  handleMoreOptionsClick(): void {
    this.openOptions.set(true);
  }

  handleSaveClick(): void {
    this.openOptions.set(false);
    this.onSave.emit(this.post()._id);
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
