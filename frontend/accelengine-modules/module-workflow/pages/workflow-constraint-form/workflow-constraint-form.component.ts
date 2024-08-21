import { Component, Injector, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

//Components

//Models
import { ConstraintFieldDTO, FieldType, WorkflowConstraint } from '../../models/workflow.model';

//Services

// Helpers
import { CodeNameEntity, FormPopupComponent } from 'accelengine-lib';


@Component({
  selector: 'app-workflow-constraint-form',
  templateUrl: './workflow-constraint-form.component.html',
  styleUrls: ['./workflow-constraint-form.component.scss']
})
export class WorkflowConstraintFormComponent extends FormPopupComponent<WorkflowConstraint> implements OnInit {
  operations: CodeNameEntity[] = [];
  valueDateBol: boolean;
  fileds: ConstraintFieldDTO[] = [];

  numberOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '==', name: 'Égal à' },
    { code: '!=', name: 'N\'est pas égal à' },
    { code: '<', name: 'Inférieur à' },
    { code: '<=', name: 'Inférieur ou égal à' },
    { code: '>', name: 'Supérieur à' },
    { code: '>=', name: 'Supérieur ou égal à' }
  ]);

  dateOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '=DATEEQUAL=', name: 'Égal à' },
    { code: '=DATENOTEQUAL=', name: 'N\'est pas égal à' },
    { code: '=DATELESSTHAN=', name: 'Inférieur à' },
    { code: '=DATELESSTHANOREQUAL=', name: 'Inférieur ou égal à' },
    { code: '=DATEGREATERTHAN=', name: 'Supérieur à' },
    { code: '=DATEGREATERTHANOREQUAL=', name: 'Supérieur ou égal à' }
  ]);

  operators: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '&&', name: '&&' },
    { code: '||', name: '||' },

  ]);
  constructor(injector: Injector) {
    super(injector, WorkflowConstraint);
    this.formGroup = this.formBuilder.group({
      operation: [this.data.operation, [Validators.required]],
      operator: [this.data.operator, [Validators.required]],
      filedName: [this.data.filedName, [Validators.required]],
      filedType: [this.data.filedType, [Validators.required]],
      value: [this.data.value],
      valueDate: [this.data.valueDate],
      constraintOrder: [this.data.constraintOrder, [Validators.required]],
      filed: [null],
    })

  }

  ngOnInit(): void {
    this.fileds = this.param.fileds;
    if (this.f.filedName) {
      var filed = new ConstraintFieldDTO();
      filed.name = this.f.filedName.value;
      filed.type = this.f.filedType.value;
      this.f.filed.setValue(filed);
      this.onFiledChange(filed)
    }
  }

  changeFiled(element: ConstraintFieldDTO) {
  }

  onFiledChange(filed: ConstraintFieldDTO) {
    this.f.filedName.setValue(filed.name);
    this.f.filedType.setValue(filed.type);
    switch (filed.type) {
      case FieldType.DATE:
        this.operations = this.dateOperations;
        this.valueDateBol = true;
        break;
      case FieldType.NUMBER:
        this.operations = this.numberOperations
        this.valueDateBol = false;
        break;
    }
  }

}
