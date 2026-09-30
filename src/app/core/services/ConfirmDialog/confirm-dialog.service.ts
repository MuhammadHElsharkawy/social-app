import { inject, Service } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Service()
export class ConfirmDialogService {
  private confirmationService = inject(ConfirmationService);

  confirmDelete(deleteMessage: string, onAccept: () => void) {
    this.confirmationService.confirm({
      message: `${deleteMessage}`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => onAccept(),
    });
  }

  confirmCustom(options: {
    message: string;
    header?: string;
    acceptLabel?: string;
    acceptSeverity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'help';
    onAccept: () => void;
  }) {
    this.confirmationService.confirm({
      message: options.message,
      header: options.header || 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: {
        label: options.acceptLabel || 'Confirm',
        severity: options.acceptSeverity || 'primary',
      },
      accept: () => options.onAccept(),
    });
  }
}
