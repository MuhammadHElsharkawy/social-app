import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appReadMore]',
})
export class ReadMoreDirective implements AfterViewInit, OnDestroy {
  @Input('appReadMore') maxLines = 2;

  @Input() readMoreText = 'read more';
  @Input() readLessText = 'read less';

  private expanded = false;

  private button?: HTMLButtonElement;

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;

  private removeClickListener?: () => void;

  private checkScheduled = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly ngZone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    this.setup();

    this.ngZone.runOutsideAngular(() => {
      this.observeChanges();
      this.scheduleCheck();
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();

    this.removeClickListener?.();

    this.button?.remove();
  }

  private get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private setup(): void {
    this.renderer.setStyle(this.element, 'overflow-wrap', 'anywhere');

    this.applyCollapsedStyle();
  }

  private applyCollapsedStyle(): void {
    this.renderer.setStyle(this.element, 'display', '-webkit-box');

    this.renderer.setStyle(this.element, '-webkit-box-orient', 'vertical');

    this.renderer.setStyle(this.element, '-webkit-line-clamp', String(this.maxLines));

    this.renderer.setStyle(this.element, 'overflow', 'hidden');
  }

  private removeCollapsedStyle(): void {
    this.renderer.removeStyle(this.element, 'display');

    this.renderer.removeStyle(this.element, '-webkit-box-orient');

    this.renderer.removeStyle(this.element, '-webkit-line-clamp');

    this.renderer.removeStyle(this.element, 'overflow');
  }

  private observeChanges(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleCheck();
    });

    this.resizeObserver.observe(this.element);

    this.mutationObserver = new MutationObserver(() => {
      this.scheduleCheck();
    });

    this.mutationObserver.observe(this.element, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  private scheduleCheck(): void {
    if (this.checkScheduled) {
      return;
    }

    this.checkScheduled = true;

    requestAnimationFrame(() => {
      this.checkScheduled = false;

      if (!this.expanded) {
        this.checkOverflow();
      }
    });
  }

  private checkOverflow(): void {
    const hasOverflow = this.element.scrollHeight > this.element.clientHeight + 1;

    if (hasOverflow) {
      this.showButton();
    } else {
      this.hideButton();
    }
  }

  private showButton(): void {
    if (this.button) {
      return;
    }

    this.createButton();
  }

  private hideButton(): void {
    if (!this.button) {
      return;
    }

    this.removeClickListener?.();
    this.button.remove();

    this.button = undefined;
    this.removeClickListener = undefined;
  }

  private createButton(): void {
    const button = this.renderer.createElement('button') as HTMLButtonElement;

    this.button = button;

    this.renderer.setAttribute(button, 'type', 'button');

    this.renderer.setAttribute(button, 'aria-expanded', 'false');

    this.renderer.setAttribute(button, 'aria-label', this.readMoreText);

    this.renderer.addClass(button, 'read-more-button');

    this.renderer.setProperty(button, 'textContent', this.readMoreText);

    this.removeClickListener = this.renderer.listen(button, 'click', () => {
      this.ngZone.run(() => {
        this.toggle();
      });
    });

    this.renderer.insertBefore(this.element.parentNode, button, this.element.nextSibling);
  }

  private toggle(): void {
    this.expanded = !this.expanded;

    if (this.expanded) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private expand(): void {
    this.removeCollapsedStyle();

    if (this.button) {
      this.renderer.setProperty(this.button, 'textContent', this.readLessText);

      this.renderer.setAttribute(this.button, 'aria-expanded', 'true');

      this.renderer.setAttribute(this.button, 'aria-label', this.readLessText);
    }
  }

  private collapse(): void {
    this.applyCollapsedStyle();

    if (this.button) {
      this.renderer.setProperty(this.button, 'textContent', this.readMoreText);

      this.renderer.setAttribute(this.button, 'aria-expanded', 'false');

      this.renderer.setAttribute(this.button, 'aria-label', this.readMoreText);
    }

    this.scheduleCheck();
  }
}
