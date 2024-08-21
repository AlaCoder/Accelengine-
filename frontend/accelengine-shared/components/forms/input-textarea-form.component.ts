import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputForm } from './input-form';

// Helpers
//import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-input-textarea-form',
  templateUrl: './input-textarea-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextareaFormComponent extends InputForm implements OnChanges {

  @Input() rows: any;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isDisabled && changes.isDisabled.currentValue !== undefined) {
      if (this.isDisabled) {
        this.formGroup.get(this.name).disable();
      } else {
        this.formGroup.get(this.name).enable();
      }
    }
  }

}
