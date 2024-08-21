import { FormGroup } from '@angular/forms';

export function PaswordValidator(idControlName: string, passwordControlName: string) {
    return (formGroup: FormGroup) => {
        const id = formGroup.controls[idControlName];
        const password = formGroup.controls[passwordControlName];

        if (id.value === null && !password.value) {
            password.setErrors({ required: true });
        }
    }
}
