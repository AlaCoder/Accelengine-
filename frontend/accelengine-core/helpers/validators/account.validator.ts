import { FormGroup } from "@angular/forms";

export function accountRequiredValidator(
    idControlName: string,
    passwordControlName: string
) {
    return (formGroup: FormGroup) => {
        const id = formGroup.controls[idControlName];
        const password = formGroup.controls[passwordControlName];
        if (!id.value && !password.value) {
            password.setErrors({ required: true });
        } else if (password.errors?.required) {
            password.clearValidators();
            password.updateValueAndValidity();
        }
    };
}
