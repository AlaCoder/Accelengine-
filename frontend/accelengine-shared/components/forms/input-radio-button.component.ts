import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { InputForm } from './input-form';

// Helpers
//import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-input-radio-button',
  templateUrl: './input-radio-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputRadioButtonComponent extends InputForm implements OnInit {

  @Input() valueRB: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
