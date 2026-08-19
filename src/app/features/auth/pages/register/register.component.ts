import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideAtSign,
  LucideCalendar,
  LucideKeyRound,
  LucideMail,
  LucideUser,
  LucideUsers,
} from '@lucide/angular';
import { REG_EXP } from '../../../../core/constants/regex';
import { getSafeReturnUrl } from '../../../../core/utils/url.util';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { FieldError, InputComponent, IOption, SelectInput } from 'reusable-components';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    FieldError,
    SelectInput,
    LucideUser,
    LucideAtSign,
    LucideMail,
    LucideCalendar,
    LucideKeyRound,
    LucideUsers,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  genderOptions: IOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  isLoading = signal<boolean>(false);

  registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', Validators.pattern(REG_EXP.username)],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required, CustomValidators.featureDateValidation()]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(REG_EXP.password)]],
      rePassword: ['', [Validators.required]],
    },
    {
      validators: CustomValidators.matchFields('password', 'rePassword'),
    },
  );

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.authService
      .register(this.registerForm.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
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
          console.log(err);
        },
      });
  }
}
