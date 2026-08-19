import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static featureDateValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate: Date = new Date(control.value);
      const today: Date = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        control.setErrors({ futureDate: true });
        return { futureDate: true };
      } else {
        control.setErrors(null);
        return null;
      }
    };
  }

  static matchFields(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) return null;

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  static differFields(controlName: string, differingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const differingControl = group.get(differingControlName);

      if (!control || !differingControl) return null;

      if (differingControl.errors && !differingControl.errors['mustDiffer']) return null;

      if (control.value === differingControl.value) {
        differingControl.setErrors({ mustDiffer: true });
        return { mustDiffer: true };
      } else {
        differingControl.setErrors(null);
        return null;
      }
    };
  }
}
