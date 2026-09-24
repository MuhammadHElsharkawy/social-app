import { Component, effect, inject, input, OnDestroy, output, signal } from '@angular/core';
import {
  LucideFaceSlightlySmiling,
  LucideImage,
  LucideLoaderCircle,
  LucideSendHorizontal,
  LucideX,
} from '@lucide/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { EmojiPickerComponent } from '../../../../../shared/components/emoji-picker/emoji-picker.component';
import { ICommentContent } from '../../interfaces/comment.interface';
import { UserFacadeService } from '../../../../../core/services/user/user-facade.service';

@Component({
  imports: [
    LucideImage,
    LucideFaceSlightlySmiling,
    LucideSendHorizontal,
    EmojiPickerComponent,
    LucideX,
    LucideLoaderCircle,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
  ],
  selector: 'app-comment-text-area',
  styleUrl: './comment-text-area.component.css',
  templateUrl: './comment-text-area.component.html',
})
export class CommentTextAreaComponent implements OnDestroy {
  protected readonly userFacade = inject(UserFacadeService);

  private wasLoading = signal<boolean>(false);
  clearBeforeSuccess = input<boolean>(true);
  loading = input<boolean>(false);
  onSend = output<ICommentContent>();

  body = signal<string>('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  showEmojiPicker = signal(false);

  constructor() {
    effect(() => {
      const loading = this.loading();

      if (this.wasLoading() && !loading) this.resetForm();

      this.wasLoading.set(loading);
    });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker.update((value) => !value);
  }

  addEmoji(emoji: string) {
    this.body.update((c) => c + emoji);
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

  invalid(): boolean {
    return (!this.body() || this.body().length < 2) && !this.selectedFile();
  }

  submit(): void {
    if (this.invalid()) return;

    const data: ICommentContent = {};

    if (this.body()) data.content = this.body();
    if (this.selectedFile()) data.image = this.selectedFile()!;

    if (this.clearBeforeSuccess()) this.resetForm();

    this.onSend.emit(data);
  }

  ngOnDestroy() {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl()!);
    }
  }
}
