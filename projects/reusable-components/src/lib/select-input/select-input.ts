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
import { IOption } from './types/option.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-select-input',
  imports: [],
  templateUrl: './select-input.html',
  styleUrl: './select-input.css',
})
export class SelectInput {
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  status = signal<FormControlStatus>('VALID');
  touched = signal(false);

  isInvalid = computed(() => this.touched() && this.status() === 'INVALID');

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  label = input<string>('');
  inputId = input.required<string>();
  placeholder = input<string | null>(null);
  options = input.required<IOption[]>();
  styleType = input<'auth' | 'create-post'>();

  selectClasses = computed(() => {
    if (this.styleType() === 'auth') {
      return `
      w-full rounded-xl border bg-slate-50 py-3 pr-4
      text-sm text-slate-800 outline-none transition
      focus:bg-white
      dark:bg-slate-950/60 dark:text-slate-100
      dark:focus:bg-slate-900
      ${this.hasIcon() ? 'pl-11' : 'pl-4'}
    `;
    }

    if (this.styleType() === 'create-post') {
      return 'bg-transparent outline-none';
    }

    return '';
  });

  value = signal('');
  isDisabled = signal(false);

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

  handleChange(event: Event): void {
    const newValue = (event.target as HTMLSelectElement).value;
    this.value.set(newValue);
    this.onChange(newValue);
  }

  onBlur(): void {
    this.onTouched();
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
