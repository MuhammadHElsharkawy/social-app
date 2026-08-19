import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestComponent } from "./features/test/test.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');
}
