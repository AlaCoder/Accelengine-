import { Component, Injector, OnInit } from '@angular/core';

// Components
import { FormPopupComponent } from 'accelengine-lib';

// Services

// Models
import { DFInputElement, INPUT_TYPE_LIST } from 'accelengine-lib';

// Helpers
import { Logger } from 'accelengine-lib';
import { Validators } from '@angular/forms';
const log = new Logger('ValueFormComponent');

@Component({
  selector: 'app-forms-input-form',
  templateUrl: './forms-input-form.component.html',
  styleUrls: ['./forms-input-form.component.scss']
})
export class FormsInputFormComponent extends FormPopupComponent<DFInputElement> implements OnInit {

  input: DFInputElement;
  inputTypes = INPUT_TYPE_LIST;

  constructor(injector: Injector) {
    super(injector, DFInputElement);

    this.formGroup = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      label: [this.data.label, [Validators.required]],
      typeInput: [this.data.typeInput, [Validators.required]],
      orderInput: [this.data.orderInput, Validators.required],
    });
  }

  ngOnInit(): void {
    log.info('ngOnInit ValueFormComponent', this.data, this.param);
    this.input = this.param;
    if (this.data) {
      this.formGroup.patchValue(this.data);
    }
  }
}
