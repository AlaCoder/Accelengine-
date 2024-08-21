import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { remove } from 'lodash';

// Component
import { AECriteria, AECriteriaField, HybrideComponent } from 'accelengine-lib';

// Models
import { FieldParam, FileParam, FILE_TYPE_LIST, LineParam } from '../../models/fileparam.model';

// Services
import { FileParamService } from '../../services/fileparam.service';

// Components
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { LineParamFormComponent } from '../../forms/lineparam-form/lineparam-form.component';
import { FieldParamFormComponent } from '../../forms/fieldparam-form/fieldparam-form.component';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { ImportExportService } from '../../services/importexport.service';

const log = new Logger('FileParamMasterDetailComponent');

@Component({
  templateUrl: 'fileparam-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class FileParamMasterDetailComponent extends HybrideComponent<FileParam> implements OnInit {

  columnsLine: Column[];
  columnsField: Column[];
  indexOfOpenedPanel: number = 0;
  selectedFieldData: LineParam;
  displayFields: boolean = false;
  listTypes = FILE_TYPE_LIST;
  selectedDatas : FileParam[];

  constructor(
    injector: Injector,
    private fileParamService: FileParamService,
    private importExportService: ImportExportService
  ) {
    super(injector, FileParam, fileParamService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true, width: 200 },
      { field: 'type', header: 'Type', filter: true },
      { field: 'version', header: 'Version', filter: true }
    ]);


    this.columnsLine = Column.fromObjects([
      { field: 'description', header: 'Description', filter: true },
      { field: 'code', header: 'Code', filter: true, width: 100 },
      { field: 'type', header: 'Type', filter: true, width: 100 },
      { field: 'display', header: 'Affiché', type: ColumnType.BOOLEAN, filter: true },
      { field: 'fields', header: 'Champs', buttonLabel: 'Consulter', type: ColumnType.BUTTON }
    ]);

    this.columnsField = Column.fromObjects([
      { field: 'description', header: 'Description', filter: true },
      { field: 'code', header: 'Code', filter: true, width: 100 },
      { field: 'type', header: 'Type', filter: true, width: 100 },
      { field: 'obligatory', header: 'Obligatoire', filter: true, type: ColumnType.BOOLEAN }
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
      { field: 'code', header: 'Code', operation: '==', value: '' },
      { field: 'type', header: 'Type', operation: '==', value: '' },
      { field: 'version', header: 'version', operation: '==', value: '' },
    ]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      type: [this.selectedData.type],
      version: [this.selectedData.version],
      description: [this.selectedData.description],
      extension: [this.selectedData.extension],
      separator: [this.selectedData.separator],
    });
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
  }

  onDblclickRow(event): void {
    super.onDblclickRow(event);
    this.selectedChildData.fields = [];
    this.selectedFieldData = null;
    setTimeout(() => {
      this.indexOfOpenedPanel = 0;
    });
  }

  // UI Customized Action
  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(LineParamFormComponent, 'Ajouter Ligne').subscribe((value: LineParam) => {
      let lineIsExist: LineParam = self.selectedData.lines.find((l) => l.code.toLowerCase().includes(value.code.toLowerCase()));
      if (!lineIsExist) {
        self.selectedData.lines.push(value);
      }
    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(LineParamFormComponent, 'Modifier Ligne').subscribe(value => {
      Object.assign(self.selectedChildData, value);
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(value => {
      if (value) {
        remove(self.selectedData.lines, value);
      }
    });
  }

  onDblclickChildRow(event) {
    super.onDblclickChildRow(event);
  }

  onButtonClickEvent(event: any) {
    if (event.field === 'fields') {
      this.selectedFieldData = null;
      this.selectedChildData = event.row;
      this.displayFields = true;
      setTimeout(() => {
        this.indexOfOpenedPanel = 2;
      });
    }
  }

  onDblclickFieldRow(event) {
    this.selectedFieldData = event;
  }

  onAddFieldClick() {
    log.debug('Add Field Click');
    const self = this;
    super.addChild(FieldParamFormComponent, 'Ajouter champ').subscribe((value) => {
      let fieldParamIsAssigned: FieldParam = self.selectedChildData.fields?.find((d) => d.code === value.code);
      if (!fieldParamIsAssigned) {
        self.selectedChildData.fields.push(value);
        self.selectedChildData.fields = [...self.selectedChildData.fields];
      }
    });
  }

  onEditFieldClick() {
    log.debug('Edit Field Click');
    const self = this;
    super.editChild(FieldParamFormComponent, 'Modifier champ', { data: this.selectedFieldData }).subscribe(value => {
      Object.assign(this.selectedFieldData, value);
    });
  }

  onDeleteFieldClick() {
    log.debug('Delete Field Click');
    const self = this;
    super.deleteChild().subscribe(result => {
      if (result) {
        remove(self.selectedChildData.fields, this.selectedFieldData);
      }
    });
  }

  exporter() {
    
    let values = [0];
    this.selectedDatas.forEach(element => {
      values.push(element.id);
    });
    
    let builder1: Partial<AECriteriaField> = {};
    builder1.field = 'id';
    builder1.operation = 'IN';
    builder1.value = values;
    let criteriaField: AECriteriaField = builder1 as AECriteriaField;

    let builder2: Partial<AECriteria> = {};
    builder2.criteriaFields = [criteriaField];
    const criteria: AECriteria = builder2 as AECriteria;

    this.importExportService.exporter('RDD_IMEX_PARAM', criteria)
                            .subscribe(result => { 
                                                  log.debug(result); 
                                                  });
  }

}
