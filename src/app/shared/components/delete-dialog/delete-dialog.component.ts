import { Component, effect, input, output, signal } from '@angular/core';
import { LucideTriangleAlert, LucideX } from '@lucide/angular';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  imports: [LucideX, LucideTriangleAlert, ClickOutsideDirective],
  selector: 'app-delete-dialog',
  styleUrl: './delete-dialog.component.css',
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent {
  private wasLoading = signal<boolean>(false);

  loading = input<boolean>(false);
  title = input<string>('');
  desc = input<string>('');

  onCloseDialog = output();
  onConfirm = output();

  constructor() {
    effect(() => {
      const loading = this.loading();

      if (this.wasLoading() && !loading) this.onCloseDialog.emit();

      this.wasLoading.set(loading);
    });
  }

  closeDeleteDialog(): void {
    this.onCloseDialog.emit();
  }

  confirmDelete(): void {
    this.onConfirm.emit();
  }
}
