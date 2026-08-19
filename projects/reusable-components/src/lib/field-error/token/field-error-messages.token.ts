import { InjectionToken } from '@angular/core';
import { FieldErrorMessages } from '../types/field-error.types';

export const DEFAULT_FIELD_ERROR_MESSAGES: FieldErrorMessages = {
  required: (_e, label) => `${label || 'This field'} is required.`,
  requiredTrue: (_e, label) =>
    `You must accept ${label ? label.toLowerCase() : 'this'} to continue.`,
  email: (_e, label) => `Enter a valid ${label ? label.toLowerCase() : 'email'} address.`,
  minlength: (e, label) =>
    `${label || 'This field'} must be at least ${e.requiredLength} characters (currently ${e.actualLength}).`,
  maxlength: (e, label) =>
    `${label || 'This field'} must be no more than ${e.requiredLength} characters.`,
  min: (e, label) => `${label || 'This field'} must be ${e.min} or greater.`,
  max: (e, label) => `${label || 'This field'} must be ${e.max} or less.`,
  pattern: (_e, label) =>
    `The format entered for ${label ? label.toLowerCase() : 'this field'} isn't valid.`,
};

export const FIELD_ERROR_MESSAGES = new InjectionToken<FieldErrorMessages>('FIELD_ERROR_MESSAGES', {
  providedIn: 'root',
  factory: () => DEFAULT_FIELD_ERROR_MESSAGES,
});
