import { Component, ElementRef, ViewChild, afterNextRender, inject, output } from '@angular/core';
import { Picker } from 'emoji-mart';
import data from '@emoji-mart/data';
import { ThemeService } from '../../../core/services/themes/theme.service';

@Component({
  selector: 'app-emoji-picker',
  template: ` <div #pickerContainer></div> `,
})
export class EmojiPickerComponent {
  private readonly themeService = inject(ThemeService);

  @ViewChild('pickerContainer', { static: true })
  private pickerContainer!: ElementRef<HTMLDivElement>;

  readonly emojiSelected = output<string>();

  constructor() {
    afterNextRender(() => {
      const picker = new Picker({
        data,
        theme: this.themeService.isDarkMode() ? 'dark' : 'light',
        set: 'Facebook',

        perLine: 8,

        searchPosition: 'sticky',
        navPosition: 'bottom',
        previewPosition: 'none',

        maxFrequentRows: 2,

        onEmojiSelect: (emoji: any) => {
          this.emojiSelected.emit(emoji.native);
        },
      });

      this.pickerContainer.nativeElement.appendChild(picker as unknown as Node);
    });
  }
}
