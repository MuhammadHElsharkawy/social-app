import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import {
  LucideBookmark,
  LucideChevronDown,
  LucideEarth,
  LucideEllipsis,
  LucideImage,
  LucideMessageCircle,
  LucidePencil,
  LucideRepeat2,
  LucideShare2,
  LucideThumbsUp,
  LucideTrash2,
  LucideX,
  LucideLock,
  LucideUsers,
} from '@lucide/angular';
import { PostLikesComponent } from '../post-likes/post-likes.component';
import { PostTopCommentComponent } from '../post-top-comment/post-top-comment.component';
import { AuthService } from '../../../auth/services/auth.service';
import { IPost, PostPrivacy } from '../../interfaces/post.interfaces';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { PostFacadeService } from '../../services/post-facade.service';
import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { IUpdatePostREQ } from '../../create-post/interfaces/create-post.interface';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { PostCommentsComponent } from '../../comment/components/post-comments/post-comments.component';

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
    LucideX,
    LucideImage,
    LucideChevronDown,
    LucideLock,
    LucideUsers,
    FormsModule,
    PostCommentsComponent,
    TimeAgoPipe,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  private readonly authService = inject(AuthService);
  protected readonly postFacadeService = inject(PostFacadeService);
  private destroyRef = inject(DestroyRef);

  post = input.required<IPost>();

  openPostLikes = signal<boolean>(false);

  openPostImage = signal<boolean>(false);

  openOptions = signal<boolean>(false);
  isMyPost = computed<boolean>(() => this.authService.getUserId() === this.post().user._id);

  openDeleteDialog = signal<boolean>(false);

  postPrivacyLabel = computed(() => {
    switch (this.post().privacy) {
      case 'public':
        return 'Public';
      case 'following':
        return 'Followers';
      case 'only_me':
        return 'Only me';
      default:
        return 'Public';
    }
  });

  handleLikeClick(): void {
    this.postFacadeService.toggleLikePost(this.post()._id);
  }
  handleLikesCountClick(): void {
    if (this.post().likesCount > 0) {
      this.openPostLikes.set(true);
      this.postFacadeService.getPostLikes(this.post()._id);
    }
  }

  handleMoreOptionsClick(): void {
    this.openOptions.set(true);
  }

  handleSaveClick(): void {
    this.openOptions.set(false);
    this.postFacadeService.toggleSavePost(this.post()._id);
  }

  handleDeleteClick(): void {
    this.openOptions.set(false);
    this.openDeleteDialog.set(true);
  }

  handleConfirmDeleteClick(): void {
    this.postFacadeService
      .deletePost(this.post()._id)
      .pipe(
        finalize(() => this.openDeleteDialog.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: () => {
          toast.error("Couldn't delete this post", {
            id: `deletedpost${this.post()._id}`,
            description: 'Check your connection and try again.',
          });
        },
      });
  }

  closeDeleteDialog(): void {
    if (this.postFacadeService.deletePostLoading()) return;
    this.openDeleteDialog.set(false);
  }

  openPrivacyOptions = signal<boolean>(false);
  editMode = signal<boolean>(false);

  body = signal<string>('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  handlePrivacyOptionClick(privacy: PostPrivacy): void {
    this.openPrivacyOptions.set(false);
    this.postFacadeService.updatePostPrivacy(this.post()._id, privacy);
  }

  handleEditClick(): void {
    this.openOptions.set(false);
    this.preparePostForEdit();
  }

  preparePostForEdit(): void {
    this.editMode.set(true);
    this.previewUrl.set(this.post().image || null);
    this.body.set(this.post().body ?? '');
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

  private resetForm(): void {
    this.body.set('');
    this.removeImage();
  }

  handleSaveEditClick(): void {
    if (!this.body()) return;

    const data: IUpdatePostREQ = { body: this.body() };

    if (this.previewUrl() && this.previewUrl() !== this.post().image) {
      data.image = this.selectedFile()!;
    }
    if (!this.previewUrl()) {
      data.removeImage = true;
    }

    this.postFacadeService
      .updatePostContent(this.post()._id, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.editMode.set(false);
          this.resetForm();
        },
        error: (err) => {
          toast.error("Couldn't Update Post", {
            id: `editContentPost${this.post()._id}`,
            description: `${err.error.message}`,
          });
        },
      });
  }

  handleCancelEditClick(): void {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.previewUrl.set(null);
    this.editMode.set(false);
  }

  isCommentsOpen = signal<boolean>(false);

  toggleOpenComments(): void {
    this.isCommentsOpen.update((v) => !v);
  }

  isLiked = computed(() => this.post().likes.includes(this.authService.getUserId()));

  likeClasses = computed(() =>
    this.isLiked()
      ? 'bg-[#e7f3ff] text-[#1877f2] dark:bg-blue-950/60 dark:text-blue-400'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
  );
}
