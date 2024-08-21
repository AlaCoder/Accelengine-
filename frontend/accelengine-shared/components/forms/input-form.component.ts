import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InputForm } from './input-form';

// Helpers
//import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFormComponent extends InputForm {

  @Input() type: string = 'text';
  @Input() appendRight: string;
  @Input() appendLeft: string;
  @Input() iconRight: string;
  @Input() iconLeft: string;
  @Input() appendCheckBoxRight: boolean = false;
  @Output() onChecked: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() {
    super();
  }

  onCheckBoxValueChange(name,event) {
    const value = {"name": name,"isChecked": event.checked};
    this.onChecked.emit(value);
 
  }
}
