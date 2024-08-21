import { FormGroup } from '@angular/forms';

export function EmailIndividualAcceptValidator(individualAcceptEmailControlName: string, emailControlName: string) {
    return (formGroup: FormGroup) => {
        const individualAcceptEmail = formGroup.controls[individualAcceptEmailControlName];
        const email = formGroup.controls[emailControlName];
        if (individualAcceptEmail.value && individualAcceptEmail.value === true && !email.value) {
            email.setErrors({ required: true });
        } else {
            let errors = null;
            if (email.value && email.hasError("email")) {
                errors = { email: true };
            }
            email.setErrors(errors);
        }
    }
}
