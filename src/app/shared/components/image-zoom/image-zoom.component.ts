import { Component, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  imports: [LucideX, ClickOutsideDirective],
  selector: 'app-image-zoom',
  styleUrl: './image-zoom.component.css',
  templateUrl: './image-zoom.component.html',
})
export class ImageZoomComponent {
  imageSrc = input.required<string>();
  imageAlt = input<string>('image');

  onClose = output();

  handleCloseClick(): void {
    this.onClose.emit();
  }
}
