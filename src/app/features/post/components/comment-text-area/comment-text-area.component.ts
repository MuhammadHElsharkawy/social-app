import { Component, inject, OnDestroy, output, signal } from '@angular/core';
import {
  LucideFaceSlightlySmiling,
  LucideImage,
  LucideSendHorizontal,
  LucideX,
} from '@lucide/angular';
import { ProfileFacadeService } from '../../../profile/services/profile-facade.service';
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { ICreateCommentREQ } from '../../comment/interfaces/comment.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [
    LucideImage,
    LucideFaceSlightlySmiling,
    LucideSendHorizontal,
    EmojiPickerComponent,
    LucideX,
    ReactiveFormsModule,
    FormsModule,
  ],
  selector: 'app-comment-text-area',
  styleUrl: './comment-text-area.component.css',
  templateUrl: './comment-text-area.component.html',
})
export class CommentTextAreaComponent implements OnDestroy {
  protected readonly profileFacade = inject(ProfileFacadeService);

  onSend = output<ICreateCommentREQ>();

  body = signal<string>('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  showEmojiPicker = signal(false);

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

  onPostClick(): void {
    if (!this.body() && !this.selectedFile()) return;

    const data: ICreateCommentREQ = {};

    if (this.body()) data.content = this.body();
    if (this.selectedFile()) data.image = this.selectedFile()!;

    this.resetForm();

    this.onSend.emit(data);
  }

  ngOnDestroy() {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl()!);
    }
  }
}
