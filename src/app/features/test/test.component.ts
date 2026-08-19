import { Component } from '@angular/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  imports: [ThemeSwitcherComponent],
  selector: 'app-test',
  styleUrl: './test.component.css',
  templateUrl: './test.component.html',
})
export class TestComponent {}
