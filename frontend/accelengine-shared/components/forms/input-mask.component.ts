import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputForm } from './input-form';

@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html'
})
export class InputMaskComponent extends InputForm {

  @Input() type: string = 'text';
  @Input() appendRight: string;
  @Input() appendLeft: string;
  @Input() iconRight: string;
  @Input() iconLeft: string;
  @Input() appendCheckBoxRight: boolean = false;
  @Input() mask: string = '';
  @Input() characterPattern: string = '';
  @Output() onChecked: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }

  onCheckBoxValueChange(name, event) {
    const value = { "name": name, "isChecked": event.checked };
    this.onChecked.emit(value);
  }

}
