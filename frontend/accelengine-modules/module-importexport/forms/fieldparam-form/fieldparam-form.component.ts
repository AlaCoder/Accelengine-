import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Models
import { FieldParam, FIELD_TYPE_LIST } from '../../models/fileparam.model';

// Services

// Component
import { FormPopupComponent } from 'accelengine-lib';

// Helpers
import { Logger } from 'accelengine-lib';
const log = new Logger('FieldParamFormComponent');

@Component({
  templateUrl: 'fieldparam-form.component.html'
})
export class FieldParamFormComponent extends FormPopupComponent<FieldParam> implements OnInit {

  listTypes = FIELD_TYPE_LIST;
  disableUpdate: boolean = false;

  constructor(injector: Injector) {
    super(injector, FieldParam);

    this.formGroup = this.formBuilder.group({
      id: [this.data.id],
      code: [this.data.code, [Validators.required]],
      type: [this.data.type],
      description: [this.data.description],
      order: [this.data.order],
      obligatory: [this.data.obligatory],
      length: [this.data.length],
      formatting: [this.data.formatting],
      //format: [this.data.format],
      display: [this.data.display]
    });
  }

  ngOnInit() {
    this.data = this.param["data"];
    log.info('ngOnInit FieldParamFormComponent', this.data);
    if (this.data) {
      this.disableUpdate = true;
      this.formGroup.patchValue(this.data);
    }
  }
}
