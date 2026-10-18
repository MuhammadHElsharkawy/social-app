import {
  Component,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  inject,
  output,
} from '@angular/core';
import { Picker } from 'emoji-mart';
import { ThemeService } from '../../../core/services/themes/theme.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-emoji-picker',
  template: ` <div #pickerContainer></div> `,
})
export class EmojiPickerComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);

  emojiData: any;

  @ViewChild('pickerContainer', { static: true })
  private pickerContainer!: ElementRef<HTMLDivElement>;

  readonly emojiSelected = output<string>();

  constructor() {
    afterNextRender(() => {
      const picker = new Picker({
        data: this.emojiData,
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

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const data = await import('@emoji-mart/data');
      this.emojiData = data;
    }
  }
}
