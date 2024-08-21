import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormPopupComponent } from 'accelengine-lib';

// Components

// Services

// Models
import { DictionaryValue } from '../../../models/dictionaryValue.model';
import { AEStatus } from '@app/accelengine-std/models/aestatus.model';

// Helpers
import { Logger } from 'accelengine-lib';
import { APP_CONFIG } from '@app/app.config';
import { requiredControl } from '@app/accelengine-std/validators/status.validator';
const log = new Logger('AEStatusFormComponent');

@Component({
  templateUrl: './aestatus-form.component.html',
  styleUrls: ['./aestatus-form.component.scss']
})
export class AEStatusFormComponent extends FormPopupComponent<AEStatus> implements OnInit {

  public colors = APP_CONFIG.colors.colors2;
  isPriorityBol: boolean = false;

  constructor(injector: Injector) {
    super(injector, DictionaryValue);
    this.formGroup = this.formBuilder.group({
      code: [this.data.code, [Validators.required]],
      label: [this.data.label, [Validators.required]],
      color: [this.data.color],
      priorityLevel: [this.data.priorityLevel],
      isPriority: [this.isPriorityBol],
    }, {
      validator: [requiredControl('priorityLevel', 'isPriority')]
    });
  }

  ngOnInit(): void {
    log.info('ngOnInit AEStatusFormComponent', this.data, this.param);
    if (this.param) {
      this.isPriorityBol = this.param.isPriority
      this.f.isPriority.setValue(this.isPriorityBol)
    }
    if (this.data) {
      this.formGroup.patchValue(this.data);
    }
  }

}
