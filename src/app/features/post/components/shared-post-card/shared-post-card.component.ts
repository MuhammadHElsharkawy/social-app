import { Component, input, signal } from '@angular/core';
import { IPost } from '../../interfaces/post.interfaces';
import { LucideExternalLink } from '@lucide/angular';
import { ImageZoomComponent } from '../../../../shared/components/image-zoom/image-zoom.component';
import { CopyonclickDirective } from '../../../../shared/directives/copy-on-click.directive';

@Component({
  imports: [LucideExternalLink, ImageZoomComponent, CopyonclickDirective],
  selector: 'app-shared-post-card',
  styleUrl: './shared-post-card.component.css',
  templateUrl: './shared-post-card.component.html',
})
export class SharedPostCardComponent {
  post = input.required<IPost>();

  openPostImage = signal<boolean>(false);
}
