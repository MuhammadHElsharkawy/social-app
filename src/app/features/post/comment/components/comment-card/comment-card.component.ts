import { Component, computed, effect, inject, input, signal } from '@angular/core';
import {
  LucideEllipsis,
  LucideFaceSlightlySmiling,
  LucideImage,
  LucidePencil,
  LucideTrash2,
  LucideX,
} from '@lucide/angular';
import { IComment, ICommentContent } from '../../interfaces/comment.interface';
import { TimeAgoPipe } from '../../../../../shared/pipes/time-ago-pipe';
import { CommentRepliesComponent } from '../comment-replies/comment-replies.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { PostFacadeService } from '../../../services/post-facade.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { FormsModule } from '@angular/forms';
import { TextareaAutoResizeDirective } from '../../../../../shared/directives/textarea-auto-resize.directive';
import { EmojiPickerComponent } from '../../../../../shared/components/emoji-picker/emoji-picker.component';
import { ImageZoomComponent } from '../../../../../shared/components/image-zoom/image-zoom.component';
import { CopyonclickDirective } from '../../../../../shared/directives/copy-on-click.directive';

@Component({
  imports: [
    LucideEllipsis,
    LucidePencil,
    LucideTrash2,
    LucideImage,
    LucideFaceSlightlySmiling,
    LucideX,
    TimeAgoPipe,
    CommentRepliesComponent,
    OverlayModule,
    DeleteDialogComponent,
    FormsModule,
    TextareaAutoResizeDirective,
    EmojiPickerComponent,
    ImageZoomComponent,
    CopyonclickDirective
  ],
  selector: 'app-comment-card',
  styleUrl: './comment-card.component.css',
  templateUrl: './comment-card.component.html',
})
export class CommentCardComponent {
  protected postFacade = inject(PostFacadeService);
  private readonly authService = inject(AuthService);

  openCommentImage = signal<boolean>(false);

  comment = input.required<IComment>();
  isReply = input<boolean>(false);

  deleteDialogOpen = signal<boolean>(false);
  isMyComment = computed(() => this.authService.getUserId() === this.comment().commentCreator._id);
  uploadingMode = input<boolean>(false);
  optionsOpen = signal(false);
  editMode = signal<boolean>(false);
  editWasLoading = signal<boolean>(false);

  body = signal<string>('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  showEmojiPicker = signal(false);

  constructor() {
    effect(() => {
      const loading = this.postFacade.updateCommentLoading();

      if (this.editWasLoading() && !loading) this.handleCancelEditClick();

      this.editWasLoading.set(loading);
    });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker.update((value) => !value);
  }

  addEmoji(emoji: string) {
    this.body.update((c) => c + emoji);
  }

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

  handleEditClick(): void {
    this.optionsOpen.set(false);
    this.prepareCommentForEdit();
  }

  prepareCommentForEdit(): void {
    this.editMode.set(true);
    this.previewUrl.set(this.comment().image || null);
    this.body.set(this.comment().content ?? '');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] ?? null;

    if (file) this.selectedFile.set(file);
    this.setPreview(file);
  }

  private setPreview(file: File | null) {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);

    if (file) this.previewUrl.set(URL.createObjectURL(file));
    else this.previewUrl.set(null);
  }

  removeImage(): void {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.previewUrl.set(null);
    this.selectedFile.set(null);
  }

  backToOldImage(): void {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);

    if (this.comment().image) this.previewUrl.set(this.comment().image!);
    else this.removeImage();
  }

  private resetForm(): void {
    this.body.set('');
    this.removeImage();
  }

  handleCancelEditClick(): void {
    this.editMode.set(false);
    this.resetForm();
  }

  handleSaveEditClick(): void {
    if (!this.body()) return;

    const data: ICommentContent = { content: this.body() };

    if (this.previewUrl() && this.previewUrl() !== this.comment().image) {
      data.image = this.selectedFile()!;
    }

    this.isReply()
      ? this.postFacade.updateReply(
          this.comment().post,
          this.comment().parentComment!,
          this.comment()._id,
          data,
        )
      : this.postFacade.updateComment(this.comment().post, this.comment()._id, data);
  }
}
