import { Component, inject, input, signal } from '@angular/core';
import { IPost } from '../../interfaces/post.interfaces';
import { LucideExternalLink } from '@lucide/angular';
import { ImageZoomComponent } from '../../../../shared/components/image-zoom/image-zoom.component';
import { CopyonclickDirective } from '../../../../shared/directives/copy-on-click.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  imports: [LucideExternalLink, ImageZoomComponent, CopyonclickDirective, TranslatePipe],
  selector: 'app-shared-post-card',
  styleUrl: './shared-post-card.component.css',
  templateUrl: './shared-post-card.component.html',
})
export class SharedPostCardComponent {
  private readonly router = inject(Router);

  post = input.required<IPost>();

  openPostImage = signal<boolean>(false);

  handleOriginalPostClick(): void {
    this.router.navigate(['posts', this.post()._id]);
  }
}
