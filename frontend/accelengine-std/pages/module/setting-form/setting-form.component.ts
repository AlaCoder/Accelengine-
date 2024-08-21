import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Models
import { Setting, VALUE_TYPE_LIST } from '@app/accelengine-std/models/application.model';

// Services

// Component
import { FormPopupComponent } from 'accelengine-lib';

// Helpers
import { Logger } from 'accelengine-lib';

const log = new Logger('SettingFormComponent');

@Component({
  templateUrl: 'setting-form.component.html'
})
export class SettingFormComponent extends FormPopupComponent<Setting> implements OnInit {

  types = VALUE_TYPE_LIST;
  constructor(injector: Injector) {
    super(injector, Setting);
    this.formGroup = this.formBuilder.group({
      code: [this.data.code, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      type: [this.data.type, [Validators.required]],
      valueString: [this.data.valueString],
      valueNumber: [this.data.valueNumber],
      valueBoolean: [this.data.valueBoolean],
      displayOrder: [this.data.displayOrder, [Validators.required]],
    });
  }

  ngOnInit() {
    log.info('ngOnInit SettingFormComponent', this.data);
    if (this.data) {
      this.formGroup.patchValue(this.data);
    }

  }
}
