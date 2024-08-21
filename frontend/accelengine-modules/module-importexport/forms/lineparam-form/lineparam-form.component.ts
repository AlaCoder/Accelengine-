import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Models
import { LineParam } from '../../models/fileparam.model';

// Services

// Component
import { FormPopupComponent } from 'accelengine-lib';

// Helpers
import { Logger } from 'accelengine-lib';
const log = new Logger('LineParamFormComponent');

@Component({
  templateUrl: 'lineparam-form.component.html'
})
export class LineParamFormComponent extends FormPopupComponent<LineParam> implements OnInit {

  constructor(injector: Injector) {
    super(injector, LineParam);

    this.formGroup = this.formBuilder.group({
      id: [this.data.id],
      code: [this.data.code, [Validators.required]],
      type: [this.data.type],
      description: [this.data.description],
      display: [this.data.display],
      fields: [new Array()],
    });

  }

  ngOnInit() {
    log.info('ngOnInit LineParamFormComponent', this.data);

    if (this.data) {
      this.formGroup.patchValue(this.data);
    }

  }
}
