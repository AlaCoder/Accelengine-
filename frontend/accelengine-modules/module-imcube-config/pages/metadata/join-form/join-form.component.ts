import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormPopupComponent } from 'accelengine-lib';

//Models
import { CJoin, JOIN_TYPE_LIST } from '../../../models/metadata.model';
import { CTable } from '@app/accelengine-modules/module-imcube-config/models/table.model';

//Services

@Component({
  selector: 'app-join-form',
  templateUrl: './join-form.component.html',
})
export class JoinFormComponent extends FormPopupComponent<CJoin> implements OnInit {
  tables: Map<string, string[]> = new Map();
  parentTables: any[] = [];
  parentColumns: any[] = [];
  childTables: any[] = [];
  childColumns: any[] = [];
  typeList = JOIN_TYPE_LIST;

  constructor(injector: Injector) {
    super(injector, CJoin);
    this.formGroup = this.formBuilder.group({
      parentTable: [this.data.parentTable, [Validators.required]],
      parentColumn: [this.data.parentColumn, [Validators.required]],
      childTable: [this.data.childTable, [Validators.required]],
      childColumn: [this.data.childColumn, [Validators.required]],
      type: [this.data.type, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.parentTables = this.param;
    this.childTables = this.param;
    if (this.data.id) {
      this.data.parentTable.fullCode = this.data.parentTable.codeDatasource + "." + this.data.parentTable.code;
      this.data.childTable.fullCode = this.data.childTable.codeDatasource + "." + this.data.childTable.code;
      this.onChangeParentTableName(this.data.parentTable);
      this.onChangeChildTableName(this.data.childTable);
    }
  }

  onChangeParentTableName(table: CTable) {
    this.parentColumns = [];
    if (table) {
      this.parentColumns = table.columns;
    }
  }

  onChangeChildTableName(table: CTable) {
    this.childColumns = [];
    if (table) {
      this.childColumns = table.columns;
    }
  }

}
