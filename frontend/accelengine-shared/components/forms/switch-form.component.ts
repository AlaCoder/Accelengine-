import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { InputForm } from './input-form';

// Helpers
//import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-switch-form',
  templateUrl: './switch-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchFormComponent extends InputForm implements OnInit {

  @Input() checked: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.name && this.formGroup.get(this.name).value === null || this.formGroup.get(this.name).value === undefined) {
      this.formGroup.get(this.name).setValue(this.checked);
    }
  }

}
