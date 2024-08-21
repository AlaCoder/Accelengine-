import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
// Components
import { FormComponent } from 'accelengine-lib';

// Services
import { DynamicFormService } from '@app/accelengine-modules/module-dynamic-form/services/dynamic.form.service';

// Models
import { Document } from '@app/accelengine-std/models/application.model';
import { AEDynamicForm, DFInputElement, TYPE_INPUT } from 'accelengine-lib';

// Helpers
import { orderBy } from 'lodash';



@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent extends FormComponent<AEDynamicForm> implements OnInit, OnChanges {

  @Input() formGroup: FormGroup;
  @Input() name: string;
  @Input() idForm;
  @Input() document: Document;
  @Input() idEntity;
  @Input() isDisabled;
  @Input() isSubmitted;

  formIndex: number = -1;

  constructor(private injector: Injector,
    private dynamicFormService: DynamicFormService,
  ) {
    super(injector, AEDynamicForm);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    let bolChange = false;
    if (changes.idEntity && changes.idEntity.currentValue) {
      this.idEntity = changes.idEntity.currentValue
      bolChange = true;
    }

    if (changes.idForm && changes.idForm.currentValue) {
      this.idForm = changes.idForm.currentValue
      bolChange = true;
    }

    if (changes.formGroup && changes.formGroup.currentValue) {
      this.formGroup = changes.formGroup.currentValue
      bolChange = true;
    }

    if (bolChange)
      this.initData();
  }

  initData() {
    this.getInputs.controls = [];
    if (this.idForm) {
      if (this.idEntity == null)
        this.idEntity = -1;
      this.subscriptions.push(this.dynamicFormService.getValues(this.idForm, this.idEntity, this.document.id).subscribe((form: AEDynamicForm) => {
        if (form) {
          form.inputs = orderBy(form.inputs, ['orderInput'], ['asc']);
          form.inputs.map((input: DFInputElement) => {
            this.getInputs.push(this.newInput(input));
          });
        }
      }));
    }
  }

  get getInputs(): FormArray {
    return this.formGroup.get(this.name) as FormArray
  }

  newInput(input: DFInputElement): FormGroup {
    var value = null;
    if (input.value)
      switch (input.typeInput) {
        case TYPE_INPUT.NUMBER:
          value = input.value.valueNumber;
          break;
        case TYPE_INPUT.DATE:
          value = input.value.valueDate;
          break;
        default:
          value = input.value.valueString;
      }

    return this.formBuilder.group({
      id: [input.id],
      name: [input.name],
      label: [input.label],
      typeInput: [input.typeInput],
      value: [value],
    })
  }

  isTypeText(input: DFInputElement) {
    return input.typeInput == TYPE_INPUT.TEXT;
  }

  isTypeTextarea(input: DFInputElement) {
    return input.typeInput == TYPE_INPUT.TEXTAREA;
  }

  isTypeDate(input: DFInputElement) {
    return input.typeInput == TYPE_INPUT.DATE;
  }

  isTypeNumber(input: DFInputElement) {
    return input.typeInput == TYPE_INPUT.NUMBER;
  }


}
