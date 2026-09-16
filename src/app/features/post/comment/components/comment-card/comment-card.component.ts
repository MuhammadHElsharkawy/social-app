import { Component, computed, inject, input, output, signal } from '@angular/core';
import { LucideEllipsis, LucidePencil, LucideTrash2 } from '@lucide/angular';
import { IComment } from '../../interfaces/comment.interface';
import { TimeAgoPipe } from '../../../../../shared/pipes/time-ago-pipe';
import { CommentRepliesComponent } from '../comment-replies/comment-replies.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { PostFacadeService } from '../../../services/post-facade.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  imports: [
    LucideEllipsis,
    LucidePencil,
    LucideTrash2,
    TimeAgoPipe,
    CommentRepliesComponent,
    OverlayModule,
    DeleteDialogComponent,
  ],
  selector: 'app-comment-card',
  styleUrl: './comment-card.component.css',
  templateUrl: './comment-card.component.html',
})
export class CommentCardComponent {
  protected postFacade = inject(PostFacadeService);
  private readonly authService = inject(AuthService);

  deleteDialogOpen = signal<boolean>(false);
  isMyComment = computed(() => this.authService.getUserId() === this.comment().commentCreator._id);
  uploadingMode = input<boolean>(false);
  optionsOpen = signal(false);

  comment = input.required<IComment>();
  isReply = input<boolean>(false);

  openDeleteDialog(): void {
    this.deleteDialogOpen.set(true);
  }

  closeDeleteDialog(): void {
    this.deleteDialogOpen.set(false);
  }

  toggleOpenOptions(): void {
    this.optionsOpen.update((v) => !v);
  }

  handleDeleteClick(): void {
    this.optionsOpen.set(false);
    this.openDeleteDialog();
  }

  handleConfirmDeleteClick(): void {
    this.isReply()
      ? this.postFacade.deleteReply(
          this.comment().post,
          this.comment().parentComment!,
          this.comment()._id,
        )
      : this.postFacade.deleteComment(this.comment().post, this.comment()._id);
  }

  handleLikeClick(): void {
    this.isReply()
      ? this.postFacade.toggleLikeReply(
          this.comment().post,
          this.comment().parentComment!,
          this.comment()._id,
        )
      : this.postFacade.toggleLikeComment(this.comment().post, this.comment()._id);
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
