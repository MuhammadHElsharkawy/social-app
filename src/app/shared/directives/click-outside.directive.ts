import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef);

  readonly appClickOutside = output<void>();

  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
    
    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
