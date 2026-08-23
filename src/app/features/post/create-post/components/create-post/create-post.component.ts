import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LucideEarth,
  LucideFaceSlightlySmiling,
  LucideImage,
  LucideSend,
  LucideX,
} from '@lucide/angular';
import { IOption, SelectInput } from 'reusable-components';
import { EmojiPickerComponent } from '../../../../../shared/components/emoji-picker/emoji-picker.component';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { PostFacadeService } from '../../../services/post-facade.service';
import { PostApiService } from '../../../services/post-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpEventType } from '@angular/common/http';

@Component({
  imports: [
    LucideEarth,
    SelectInput,
    LucideEarth,
    LucideImage,
    LucideFaceSlightlySmiling,
    LucideSend,
    LucideX,
    ReactiveFormsModule,
    FormsModule,
    EmojiPickerComponent,
    ClickOutsideDirective,
  ],
  selector: 'app-create-post',
  styleUrl: './create-post.component.css',
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  private readonly postFacadeService = inject(PostFacadeService);
  private readonly destroyRef = inject(DestroyRef);

  privacyOptions: IOption[] = [
    { label: 'Public', value: 'public' },
    { label: 'Followers', value: 'following' },
    { label: 'Only me', value: 'only_me' },
  ];

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

    const draftBody = this.body();
    const draftFile = this.selectedFile();
    // const draftPreview = this.previewUrl();
    // console.log('preview: ', this.previewUrl());

    const data: FormData = new FormData();
    if (this.body) data.append('body', this.body());
    if (this.selectedFile()) data.append('image', this.selectedFile()!, this.selectedFile()?.name);

    this.resetForm();

    this.postFacadeService.createPost(data).subscribe({
      next: (res) => console.log(res),
      error: () => {
        console.log('draft body: ', draftBody);
        console.log('draft image: ', draftFile);
        // console.log('draft preview: ', draftPreview);

        this.body.set(draftBody);
        this.selectedFile.set(draftFile);
        this.setPreview(this.selectedFile());
      },
    });
  }

  ngOnDestroy() {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl()!);
    }
  }
}
