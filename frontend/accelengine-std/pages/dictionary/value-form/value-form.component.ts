import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormPopupComponent } from 'accelengine-lib';

// Components

// Services

// Models
import { DictionaryValue } from '../../../models/dictionaryValue.model';
import { DictionaryType } from '../../../models/dictionaryType.model';

// Helpers
import { Logger } from 'accelengine-lib';
const log = new Logger('ValueFormComponent');

@Component({
  templateUrl: './value-form.component.html',
  styleUrls: ['./value-form.component.scss']
})
export class ValueFormComponent extends FormPopupComponent<DictionaryValue> implements OnInit {

  dictionaryType: DictionaryType;

  constructor(injector: Injector) {
    super(injector, DictionaryValue);
    this.formGroup = this.formBuilder.group({
      code: [this.data.code, [Validators.required]],
      label: [this.data.label, [Validators.required]],
      description: [this.data.description],
      valString1: [this.data.valString1],
      valString2: [this.data.valString2],
      valString3: [this.data.valString3],
      valInt1: [this.data.valInt1],
      valInt2: [this.data.valInt2],
      valInt3: [this.data.valInt3],
      valBool1: [this.data.valBool1],
      valBool2: [this.data.valBool2],
      valBool3: [this.data.valBool3],
      valDate1: [this.data.valDate1],
      valDate2: [this.data.valDate2],
      valDate3: [this.data.valDate3]
    });
  }

  ngOnInit(): void {
    log.info('ngOnInit ValueFormComponent', this.data, this.param);
    this.dictionaryType = this.param;
    if (this.data) {
      this.formGroup.patchValue(this.data);
    }
  }

}
