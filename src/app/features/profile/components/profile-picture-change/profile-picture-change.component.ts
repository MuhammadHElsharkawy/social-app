import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { FormsModule } from '@angular/forms';
import { IOption, SelectInput } from 'reusable-components';
import { PostPrivacy } from '../../../post/interfaces/post.interfaces';
import { IUpdateProfilePictureData } from '../../interfaces/profile.interface';

@Component({
  imports: [ClickOutsideDirective, FormsModule, SelectInput],
  selector: 'app-profile-picture-change',
  styleUrl: './profile-picture-change.component.css',
  templateUrl: './profile-picture-change.component.html',
})
export class ProfilePictureChangeComponent implements OnInit {
  private wasLoading = signal<boolean>(false);

  picture = input.required<File>();
  loading = input<boolean>(false);
  type = input<'profile' | 'cover'>('cover');

  onClose = output();
  onSubmit = output<IUpdateProfilePictureData>();

  previewUrl = signal<string | null>(null);

  privacyOptions: IOption[] = [
    { label: 'Public', value: 'public' },
    { label: 'Followers', value: 'following' },
    { label: 'Only me', value: 'only_me' },
  ];

  selectedPrivacy = signal<PostPrivacy>('public');

  constructor() {
    effect(() => {
      const loading = this.loading();

      if (this.wasLoading() && !loading) this.onClose.emit();

      this.wasLoading.set(loading);
    });
  }

  @ViewChild('image')
  private imageElement!: ElementRef<HTMLImageElement>;

  private readonly OUTPUT_SIZE = 512;

  zoomLevel = signal<number>(1);
  imagePosition = signal({ x: 0, y: 0 });

  private isDragging = signal<boolean>(false);

  private imageNaturalWidth = signal<number>(0);
  private imageNaturalHeight = signal<number>(0);

  private cropWidth = signal<number>(0);
  private cropHeight = signal<number>(0);

  private baseScale = signal<number>(1);

  private dragStart = {
    mouseX: 0,
    mouseY: 0,
    imageX: 0,
    imageY: 0,
  };

  readonly displayedWidth = computed(
    () => this.imageNaturalWidth() * this.baseScale() * this.zoomLevel(),
  );

  readonly displayedHeight = computed(
    () => this.imageNaturalHeight() * this.baseScale() * this.zoomLevel(),
  );

  readonly imageTransform = computed(() => {
    const { x, y } = this.imagePosition();
    return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });

  onImageLoad(image: HTMLImageElement, cropArea: HTMLElement): void {
    this.imageNaturalWidth.set(image.naturalWidth);
    this.imageNaturalHeight.set(image.naturalHeight);

    this.cropWidth.set(cropArea.clientWidth);
    this.cropHeight.set(cropArea.clientHeight);

    this.baseScale.set(
      Math.max(
        this.cropWidth() / this.imageNaturalWidth(),
        this.cropHeight() / this.imageNaturalHeight(),
      ),
    );

    this.imagePosition.set({ x: 0, y: 0 });
  }

  onZoomChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.zoomLevel.set(Number(input.value));
    this.clampPosition();
  }

  private getPositionBounds(): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    const imageWidth = this.displayedWidth();
    const imageHeight = this.displayedHeight();

    const horizontalOverflow = Math.max(0, imageWidth - this.cropWidth());
    const verticalOverflow = Math.max(0, imageHeight - this.cropHeight());

    return {
      minX: -horizontalOverflow / 2,
      maxX: horizontalOverflow / 2,

      minY: -verticalOverflow / 2,
      maxY: verticalOverflow / 2,
    };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private clampPosition(): void {
    const bounds = this.getPositionBounds();
    const position = this.imagePosition();

    this.imagePosition.set({
      x: this.clamp(position.x, bounds.minX, bounds.maxX),
      y: this.clamp(position.y, bounds.minY, bounds.maxY),
    });
  }

  onPointerDown(event: PointerEvent): void {
    const position = this.imagePosition();

    this.dragStart = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      imageX: position.x,
      imageY: position.y,
    };

    this.isDragging.set(true);

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) {
      return;
    }

    const deltaX = event.clientX - this.dragStart.mouseX;
    const deltaY = event.clientY - this.dragStart.mouseY;

    const newX = this.dragStart.imageX + deltaX;
    const newY = this.dragStart.imageY + deltaY;

    const bounds = this.getPositionBounds();

    this.imagePosition.set({
      x: this.clamp(newX, bounds.minX, bounds.maxX),
      y: this.clamp(newY, bounds.minY, bounds.maxY),
    });
  }

  onPointerUp(): void {
    this.isDragging.set(false);
  }

  async savePhoto(): Promise<File> {
    if (this.type() === 'cover') {
      return this.picture();
    } else {
      const image = this.imageElement.nativeElement;

      const canvas = document.createElement('canvas');

      canvas.width = this.OUTPUT_SIZE;
      canvas.height = this.OUTPUT_SIZE;

      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      const naturalWidth = this.imageNaturalWidth();
      const naturalHeight = this.imageNaturalHeight();

      const scale = this.displayedWidth() / naturalWidth;

      const sourceWidth = this.cropWidth() / scale;
      const sourceHeight = this.cropHeight() / scale;

      const { x, y } = this.imagePosition();

      const sourceX = (naturalWidth - sourceWidth) / 2 - x / scale;
      const sourceY = (naturalHeight - sourceHeight) / 2 - y / scale;

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        this.OUTPUT_SIZE,
        this.OUTPUT_SIZE,
      );

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });

      if (!blob) {
        throw new Error('Failed to create cropped image');
      }

      return new File([blob], 'profile-photo.jpg', {
        type: 'image/jpeg',
      });
    }
  }

  handleCloseClick(): void {
    this.onClose.emit();
  }

  async handleSubmit(): Promise<void> {
    const file = await this.savePhoto();
    this.onSubmit.emit({ picture: file, privacy: this.selectedPrivacy() });
  }

  private setPreview(file: File) {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.previewUrl.set(URL.createObjectURL(file));
  }

  ngOnInit(): void {
    this.setPreview(this.picture());
  }
}
