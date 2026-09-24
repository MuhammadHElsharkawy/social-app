import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { toast } from 'ngx-sonner';

@Directive({
  selector: '[appCopyOnClick]',
})
export class CopyonclickDirective {
  readonly copyText = input.required<string>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  @HostListener('click')
  async onclick(): Promise<void> {
    const text = this.copyText();

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  }
}
