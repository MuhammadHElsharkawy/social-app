import { Component, computed, inject, input, output, signal } from '@angular/core';
import { LucideEllipsis } from '@lucide/angular';
import { IComment } from '../../interfaces/comment.interface';
import { TimeAgoPipe } from '../../../../../shared/pipes/time-ago-pipe';
import { CommentRepliesComponent } from '../comment-replies/comment-replies.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { PostFacadeService } from '../../../services/post-facade.service';

@Component({
  imports: [LucideEllipsis, TimeAgoPipe, CommentRepliesComponent],
  selector: 'app-comment-card',
  styleUrl: './comment-card.component.css',
  templateUrl: './comment-card.component.html',
})
export class CommentCardComponent {
  protected postFacade = inject(PostFacadeService);
  private readonly authService = inject(AuthService);

  uploadingMode = input<boolean>(false);
  comment = input.required<IComment>();
  isReply = input<boolean>(false);

  handleLikeClick(): void {
    this.postFacade.toggleLikeComment(this.comment().post, this.comment()._id);
  }

  isRepliesOpen = signal<boolean>(false);
  toggleRepliesOpen(): void {
    this.isRepliesOpen.update((v) => !v);
  }

  isLiked = computed(() => this.comment().likes.includes(this.authService.getUserId()));
  likeClasses = computed(() =>
    this.isLiked() ? 'text-[#1877f2] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400',
  );
}
