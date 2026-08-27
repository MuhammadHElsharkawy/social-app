import { Component, DestroyRef, inject, signal } from '@angular/core';
import { LucideKeyRound } from '@lucide/angular';
import { ChangePasswordService } from '../../services/change-password.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorMessageComponent } from '../../../../shared/components/form-error-message/form-error-message.component';
import { REG_EXP } from '../../../../core/constants/regex';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { ChangePasswordREQ, ChangePasswordRES } from '../../interfaces/change-password.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { InputComponent } from 'reusable-components';
import { AuthService } from '../../../auth/services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  imports: [LucideKeyRound, FormErrorMessageComponent, ReactiveFormsModule, InputComponent],
  selector: 'app-security-tab',
  styleUrl: './security-tab.component.css',
  templateUrl: './security-tab.component.html',
})
export class SecurityTabComponent {
  private readonly changePasswordService = inject(ChangePasswordService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  changePasswordForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(REG_EXP.password)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.matchFields('newPassword', 'confirmPassword'),
        CustomValidators.differFields('password', 'newPassword'),
      ],
    },
  );

  // test() {
  //   toast.error("Couldn't Update Privacy");
  //   
  //   console.log('test');
  // }

  changePassword(): void {
    if (this.changePasswordForm.invalid) return;

    this.errorMessage.set(null);
    this.isLoading.set(true);

    const data: ChangePasswordREQ = {
      password: this.changePasswordForm.controls['password'].value,
      newPassword: this.changePasswordForm.controls['newPassword'].value,
    };

    this.changePasswordService
      .changePassword(data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (res: ChangePasswordRES) => {
          this.authService.saveToken(res.data.token);
          this.router.navigate(['/home']);
          toast.success('Password Changed Successfully');
        },
        error: (err) => {
          this.errorMessage.set(err.error.message);
        },
      });
  }
}
