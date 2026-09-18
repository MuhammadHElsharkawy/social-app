import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]',
})
export class TextareaAutoResizeDirective {
  private readonly element = inject(ElementRef<HTMLTextAreaElement>);

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.resize());
  }

  @HostListener('input')
  resize(): void {
    const textarea = this.element.nativeElement;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
