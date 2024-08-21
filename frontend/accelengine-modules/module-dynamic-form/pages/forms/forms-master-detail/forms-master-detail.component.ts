import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { remove } from 'lodash';

// Components
import { HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@app/accelengine-shared/components/criteria/criteria.component';
import { FormsInputFormComponent } from '../forms-input-form/forms-input-form.component';

// Services
import { DynamicFormService } from '@app/accelengine-modules/module-dynamic-form/services/dynamic.form.service';
import { DocumentService } from '@app/accelengine-std/services/document.service';

// Models
import { Column, ColumnType } from '@app/accelengine-shared/components/data-table/data-table.model';
import { Document } from '@app/accelengine-std/models/application.model';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { AEDynamicForm, DFInputElement, INPUT_TYPE_LIST } from 'accelengine-lib';

const log = new Logger('TypeMasterDetailComponent');

@Component({
  selector: 'app-forms-master-detail',
  templateUrl: './forms-master-detail.component.html',
  styleUrls: ['./forms-master-detail.component.scss'],
  animations: APP_CONFIG.app.animations

})
export class FormsMasterDetailComponent extends HybrideComponent<AEDynamicForm> implements OnInit {

  documents: Document[] = [];

  constructor(injector: Injector,
    public dynamicFormService: DynamicFormService,
    private documentService: DocumentService
  ) {
    super(injector, AEDynamicForm, dynamicFormService, CriteriaComponent);

    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true, width: 200 },
      { field: 'name', header: 'Nom', filter: true, width: 200 },
      { field: 'document.code', header: 'Document', filter: true },
      { field: 'complementaryFields', header: 'form.label_complementary_fields', type: ColumnType.BOOLEAN },
    ]);

    this.columnsChild = Column.fromObjects([
      { field: 'name', header: 'Nom', filter: true, width: 200 },
      { field: 'typeInput', header: 'Type input', filter: true, list: INPUT_TYPE_LIST }
    ]);

    this.formGroup = this.formBuilder.group({
      code: [this.selectedData.code, [Validators.required]],
      name: [this.selectedData.name, [Validators.required]],
      document: [this.selectedData.document, [Validators.required]],
      complementaryFields: [this.selectedData.complementaryFields],
    })
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
  }

  // Init
  initUI() {
    // Do not remove
    super.initUI();
    log.debug('Init UI');
  }

  initData() {
    // Do not remove
    super.initData();
    log.debug('Init Data');
    this.subscriptions.push(this.documentService.getAllActivate().subscribe(result => {
      if (result) {
        this.documents = result.datas;
      }
    }));
  }

  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(FormsInputFormComponent, 'Ajouter input', this.formGroup.value).subscribe((value: DFInputElement) => {
      if (!self.selectedData.inputs)
        self.selectedData.inputs = [];
      self.selectedData.inputs.push(value);
    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(FormsInputFormComponent, 'Modifier input', this.formGroup.value).subscribe(value => {
      Object.assign(self.selectedChildData, value);
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(value => {
      if (value) {
        remove(self.selectedData.inputs, value);
      }
    });
  }
}
