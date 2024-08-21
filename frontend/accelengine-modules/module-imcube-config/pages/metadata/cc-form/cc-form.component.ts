import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { each } from 'lodash';

import { FormPopupComponent } from 'accelengine-lib';

//Models
import { CCColumn, CJoin, JOIN_TYPE_LIST } from '../../../models/metadata.model';
import { CColumn, COLUMN_TYPE_LIST, CTable } from '@app/accelengine-modules/module-imcube-config/models/table.model';

//Services

@Component({
  selector: 'app-cc-form',
  templateUrl: './cc-form.component.html',
})
export class CCFormComponent extends FormPopupComponent<CCColumn> implements OnInit {
  typeList = COLUMN_TYPE_LIST;
  expression: string;
  columns: any[] = [];
  paramColumns: CColumn[] = [];

  constructor(injector: Injector) {
    super(injector, CJoin);
    this.formGroup = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      code: [this.data.code, [Validators.required]],
      type: [this.data.type, [Validators.required]],
      expression: [this.data.expression, [Validators.required]],
      paramColumns: [this.data.paramColumns, [Validators.required]],
      col: [null],
    });
  }

  ngOnInit(): void {
    const self = this;
    this.paramColumns = this.formGroup.get("paramColumns").value;
    each(this.param, function (table: CTable) {
      each(table.columns, function (column: CColumn) {
        self.columns.push(column);
      });
    });

    if (this.data.id) {
    }
  }

  addCol(): void {
    var col = this.formGroup.get("col").value;
    var expression = this.formGroup.get("expression").value;
    if (expression == null) {
      expression = '';
    } else {
      expression = expression.replace('<p>', '');
      expression = expression.replace('</p>', '');
    }

    if(this.paramColumns == null){
      this.paramColumns = [];
    }

    this.paramColumns.push(col);
    this.formGroup.get("paramColumns").setValue(this.paramColumns);
    var colName = col.code.split(".")[2];
    expression = expression + ' <strong>[' + colName + ']</strong>';
    this.formGroup.get("expression").setValue(expression);
    this.formGroup.get("col").setValue(null);
  }



}
