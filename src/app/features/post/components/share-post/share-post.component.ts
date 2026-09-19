import { Component, effect, input, output, signal } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { IPost, ISharePostREQ } from '../../interfaces/post.interfaces';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [LucideX, ClickOutsideDirective, FormsModule],
  selector: 'app-share-post',
  styleUrl: './share-post.component.css',
  templateUrl: './share-post.component.html',
})
export class SharePostComponent {
  private wasLoading = signal<boolean>(false);

  post = input.required<IPost>();
  loading = input<boolean>(false);

  onClose = output();
  onShare = output<ISharePostREQ>();

  body = signal<string>('');

  constructor() {
    effect(() => {
      const loading = this.loading();

      if (this.wasLoading() && !loading) this.onClose.emit();

      this.wasLoading.set(loading);
    });
  }

  handleCloseClick(): void {
    this.onClose.emit();
  }

  handleShareClick(): void {
    const data: ISharePostREQ = {};
    if (this.body().trim().length > 0) data.body = this.body();

    this.onShare.emit(data);
  }
}
