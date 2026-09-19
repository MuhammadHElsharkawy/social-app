import { Component, input, signal } from '@angular/core';
import { IPost } from '../../interfaces/post.interfaces';
import { LucideExternalLink } from '@lucide/angular';
import { ImageZoomComponent } from '../../../../shared/components/image-zoom/image-zoom.component';

@Component({
  imports: [LucideExternalLink, ImageZoomComponent],
  selector: 'app-shared-post-card',
  styleUrl: './shared-post-card.component.css',
  templateUrl: './shared-post-card.component.html',
})
export class SharedPostCardComponent {
  post = input.required<IPost>();

  openPostImage = signal<boolean>(false);
}
