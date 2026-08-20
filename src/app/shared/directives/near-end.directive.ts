import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[appNearEnd]',
})
export class NearEndDirective {
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  rootMargin = input('500px');
  nearEnd = output<void>();

  private observer?: IntersectionObserver;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        this.observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              this.nearEnd.emit();
            }
          },
          { rootMargin: this.rootMargin() },
        );
        this.observer.observe(this.el.nativeElement);
      });

      this.destroyRef.onDestroy(() => this.observer?.disconnect());
    }
  }
}
