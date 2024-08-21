import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InputForm } from './input-form';

@Component({
    selector: 'app-number-form',
    templateUrl: './input-number.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNumberComponent extends InputForm {

    @Input() minDigits: number;
    @Input() maxDigits: number;
    @Input() mode: string;
    @Input() maxlength: number;
    @Input() showButtons: boolean;
    @Input() min: number;
    @Input() max: number;
    @Input() currency: string;
    @Input() locale: string;
    @Input() prefix: string;
    @Input() suffix: string;

    constructor() {
        super();
    }

}
