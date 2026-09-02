import { Component, inject, input, signal } from '@angular/core';
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
import { IUser } from '../../../../../core/interfaces/user.interface';
import { ICreatePostREQ } from '../../interfaces/create-post.interface';
import { toast } from 'ngx-sonner';

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

  myData = input.required<IUser | null>();

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

    const data: ICreatePostREQ = {
      body: this.body(),
      privacy: 'public',
    };

    if (this.selectedFile()) data.image = this.selectedFile()!;

    this.resetForm();

    this.postFacadeService.createPost(data).subscribe({
      error: (err) => {
        this.body.set(draftBody);
        this.selectedFile.set(draftFile);
        this.setPreview(this.selectedFile());
        toast.error("Couldn't Create Post", {
          description: `${err.error.message}`,
        });
      },
    });
  }

  ngOnDestroy() {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl()!);
    }
  }
}
