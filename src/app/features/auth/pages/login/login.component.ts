import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideKeyRound, LucideUser } from '@lucide/angular';
import { getSafeReturnUrl } from '../../../../core/utils/url.util';
import { AuthService } from '../../services/auth.service';
import { FormErrorMessageComponent } from "../../../../shared/components/form-error-message/form-error-message.component";
import { FieldError, InputComponent } from 'reusable-components';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, LucideUser, LucideKeyRound, FieldError, FormErrorMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);

  protected readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required]],
  });

  protected login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);
    this.authService
      .login(this.loginForm.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.authService.saveToken(res.data.token);
          const rawReturnUrl = this.route.snapshot.queryParams['returnUrl'];
          const safeUrl = getSafeReturnUrl(rawReturnUrl, '/home');
          this.authService.isAuthenticated.set(true);
          this.router.navigate([safeUrl]);
        },
        error: (err) => {
          this.errorMessage.set(err.error.message);
        },
      });
  }
}
