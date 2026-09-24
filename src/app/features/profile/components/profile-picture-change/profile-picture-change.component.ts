import { Component, computed, input, output, signal } from '@angular/core';
import { IPosition } from '../../interfaces/profile.interface';

@Component({
  imports: [],
  selector: 'app-profile-picture-change',
  styleUrl: './profile-picture-change.component.css',
  templateUrl: './profile-picture-change.component.html',
})
export class ProfilePictureChangeComponent {
  picturePreview = input.required<string>();

  onClose = output();

  zoom = signal<number>(1);
  position = signal<IPosition>({ x: 0, y: 0 });
  isDragging = signal<boolean>(false);

  private imageNaturalWidth = 0;
  private imageNaturalHeight = 0;

  private cropWidth = 0;
  private cropHeight = 0;

  private baseScale = 1;

  readonly displayedWidth = computed(() => this.imageNaturalWidth * this.baseScale * this.zoom());
  readonly displayedHeight = computed(() => this.imageNaturalHeight * this.baseScale * this.zoom());

  handleCloseClick(): void {
    this.onClose.emit();
  }
}
