import { FormGroup } from "@angular/forms";

export function compareDate(controlName1: string, controlName2: string, operation: string = "=" || "!=" || ">" || ">=" || "<" || "<=", labelControl1: string, labelControl2: string) {
    return (formGroup: FormGroup) => {
        const control1 = formGroup.controls[controlName1];
        const control2 = formGroup.controls[controlName2];
        let date1InMillisecondes: number;
        let date2InMillisecondes: number;
        if (control2.errors) {
            return;
        }
        if (typeof control1.value === 'number') {
            date1InMillisecondes = control1.value;
        } else {
            date1InMillisecondes = Date.parse(control1.value);
        }
        if (typeof control2.value === 'number') {
            date2InMillisecondes = control2.value;
        } else {
            date2InMillisecondes = Date.parse(control2.value);
        }
        if (!compare(date1InMillisecondes, date2InMillisecondes, operation)) {
            control1.setErrors(getError(labelControl1, labelControl2, operation));
        } else {
            control1.setErrors(null);
        }
    }
}

function compare(date1: number, date2: number, operation: string = "=" || "!=" || ">" || ">=" || "<" || "<="): boolean {
    switch (operation) {
        case "=": {
            return date1 === date2;
        }
        case "!=": {
            return date1 !== date2;
        }
        case ">": {
            return date1 > date2;
        }
        case ">=": {
            return date1 >= date2;
        }
        case "<": {
            return date1 < date2;
        }
        case "<=": {
            return date1 <= date2;
        }
        default: {
            return false;
        }
    }
}

function getError(value1: any, value2: any, operation: string = "=" || "!=" || ">" || ">=" || "<" || "<="): any {
    switch (operation) {
        case "=": {
            return {
                equal:
                {
                    value1: value1,
                    value2: value2
                }
            };
        }
        case "!=": {
            return {
                notEqual:
                {
                    value1: value1,
                    value2: value2
                }
            };
        }
        case ">": {
            return {
                mustGreaterThan:
                {
                    value1: value1,
                    value2: value2
                }
            };
        }
        case ">=": {
            return {
                mustGreaterOrEqualThan:
                {
                    value1: value1,
                    value2: value2
                }
            };
        }
        case "<": {
            return {
                mustLessThan:
                {
                    value1: value1,
                    value2: value2
                }
            };
        }
        case "<=": {
            return {
                mustLessOrEqualThan:
                {
                    value1: value1,
                    value2: value2
                }
            };
        }
        default: {
            return null;
        }
    }
}
