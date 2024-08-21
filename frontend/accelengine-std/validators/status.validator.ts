import { FormGroup } from '@angular/forms';

export function requiredControl(controlName: string, isRequired: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.get(controlName);
        const controlBol = formGroup.get(isRequired);
        let required = false
        if (controlBol) {
            required = controlBol.value;
        }
        if (control.errors) {
            return;
        }
        if (required && !control.value) {
            control.setErrors({ required: true });
        } else {
            control.setErrors(null);
        }
    }
}
