import { ValidationErrors } from '@angular/forms';

export type FieldErrorMessage = string | ((errorValue: any, label?: string) => string);

export interface FieldErrorMessages {
  [errorKey: string]: FieldErrorMessage;
}

export type ResolvedErrors = ValidationErrors | null;
