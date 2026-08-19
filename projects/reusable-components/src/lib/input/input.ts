import {
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  FormControlStatus,
  NgControl,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideEye, LucideEyeOff } from '@lucide/angular';

@Component({
  selector: 'lib-input',
  imports: [LucideEye, LucideEyeOff],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class InputComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  status = signal<FormControlStatus>('VALID');
  touched = signal<boolean>(false);

  isInvalid = computed(() => this.touched() && this.status() === 'INVALID');

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  label = input<string>('');
  inputId = input.required<string>();
  type = input<'text' | 'email' | 'password' | 'number' | 'date'>('text');
  placeholder = input<string>('');
  styleClass = input<string>('');
  isReadonly = input<boolean>(false);

  value = signal('');
  isDisabled = signal(false);
  isPasswordVisible = signal(false);

  hasIcon = contentChild<ElementRef>('inputIcon');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string | null): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value.set(newValue);
    this.onChange(newValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  ngOnInit() {
    const control = this.ngControl?.control;
    if (!control) return;

    this.status.set(control.status);
    this.touched.set(control.touched);

    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof StatusChangeEvent) this.status.set(event.status);
      if (event instanceof TouchedChangeEvent) this.touched.set(event.touched);
    });
  }
}
