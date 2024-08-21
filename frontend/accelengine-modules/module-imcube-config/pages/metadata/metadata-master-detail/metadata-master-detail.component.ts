import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { remove, cloneDeep } from 'lodash';

// Components
import { JoinFormComponent } from '../join-form/join-form.component';
import { HybrideComponent, Logger } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { CCColumn, CJoin, CMetadata, JOIN_TYPE_LIST } from '../../../models/metadata.model';
import { CDatasource } from '../../../models/datasource.model';
import { CColumn, COLUMN_TYPE_LIST, CTable } from '../../../models/table.model';

// Services
import { DatasourceService } from '../../../services/datasource.service';
import { MetadataService } from '../../../services/metadata.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { CCFormComponent } from '../cc-form/cc-form.component';
const log = new Logger('MetadataMasterDetailComponent');

@Component({
  templateUrl: 'metadata-master-detail.component.html',
  styleUrls: ['./metadata-master-detail.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class MetadataMasterDetailComponent extends HybrideComponent<CMetadata> implements OnInit {

  allDatasources: CDatasource[] = [];
  columnsJoin: Column[] = [];
  databaseTypes: string[] = [];

  tables: CTable[] = [];
  groupColumns: any[] = [];

  selectedTables: CTable[] = [];
  selectedTablesWithCol: CTable[] = [];
  selectedColumns: CColumn[] = [];

  columnsCC: Column[] = [];

  incrementTo: Map<string, number> = new Map();
  incrementFrom: Map<string, number> = new Map();

  constructor(
    injector: Injector,
    private metadataService: MetadataService,
    private datasourceService: DatasourceService,
    private changeRef: ChangeDetectorRef) {
    super(injector, CMetadata, metadataService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code' },
      { field: 'description', header: 'Description' },
      { field: 'tables', header: 'Tables', type: ColumnType.LIST, fieldArray: 'name' },
      { field: 'factTable.name', header: 'Fact' }
    ]);

    this.columnsJoin = Column.fromObjects([
      { field: 'parentTable.name', header: 'Parent' },
      { field: 'parentColumn.name', header: 'Column' },
      { field: 'type', header: 'Type', list: JOIN_TYPE_LIST },
      { field: 'childTable.name', header: 'Child' },
      { field: 'childColumn.name', header: 'Column' }
    ]);


    this.columnsCC = Column.fromObjects([
      { field: 'name', header: 'Nom' },
      { field: 'type', header: 'Type', list: COLUMN_TYPE_LIST },
      { field: 'paramColumns', header: 'Paramètres', type: ColumnType.LIST, fieldArray: 'name' },
    ]);

    this.pagination = false;
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      description: [this.selectedData.description],
      tables: [this.selectedData.tables, [Validators.required]],
      factTable: [this.selectedData.factTable, [Validators.required]],
      joins: [this.selectedData.joins],
      columns: [null, [Validators.required]],
      namesOfTables: this.formBuilder.array([])
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

    this.groupColumns = [];
    this.selectedTables = [];
    this.selectedTablesWithCol = [];
    this.selectedColumns = [];
  }

  initData() {
    // Do not remove
    super.initData();
    log.debug('Init Data');
    this.datasourceService.getAllActivate().subscribe((results) => {
      this.allDatasources = results.datas;
      if (results) {
        this.tables = [];
        this.allDatasources.forEach((datasource: CDatasource) => {
          datasource.tables.forEach(table => {
            table.fullCode = table.codeDatasource + "." + table.code;
            table.columns.forEach((column: CColumn) => {
              column.fullCode = table.codeDatasource + "." + column.code;
            })
            this.tables.push(table);
          });
        });
      }
    });
  }

  initForm(): void {
    this.formGroup.get("namesOfTables").reset();
    (<FormArray>this.formGroup.get('namesOfTables')).controls = [];
    this.allDatasources?.forEach((datasource: CDatasource) => {
      datasource.tables.forEach(table => {
        this.addFormGroup(table);
      });
    });
  }

  addFormGroup(table: CTable) {
    const namesOfTables = <FormArray>this.formGroup.controls['namesOfTables'];
    let tableFromMetadata: CTable = this.selectedData.tables.find((t: CTable) => t.code === table.code);
    namesOfTables.push(this.formBuilder.group({
      fullCode: [table.fullCode, Validators.required],
      name: [tableFromMetadata ? tableFromMetadata.name : table.name, Validators.required]
    }));
  }

  namesOfTablesControls() {
    return (<FormArray>this.formGroup.get('namesOfTables')).controls;
  }

  onDblclickRow(row: CMetadata) {
    if (row.factTable) {
      row.factTable.fullCode = row.factTable.codeDatasource + "." + row.factTable.code;
    }
    super.onDblclickRow(row);
    this.initForm();
    if (this.formGroup.value.tables) {
      this.selectedTables = this.formGroup.value.tables;
      this.selectedTablesWithCol = row.tables;
      this.selectedTablesWithCol.forEach(table => {
        table.fullCode = table.codeDatasource + "." + table.code;
      });
      this.selectedTables.forEach(table => {
        table.columns.forEach(column => {
          column.fullCode = table.codeDatasource + "." + column.code;
          this.selectedColumns.push(column);
        });
        table.fullCode = table.codeDatasource + "." + table.code;
      });
    }
    this.buildColumns();
  }

  onTableClick(event) {
    this.onEditClick();
    if (this.selectedTables.find(sc => sc.fullCode === event.option.fullCode)) {
      this.selectedTables = this.selectedTables.filter(sc => sc.fullCode !== event.option.fullCode);
      //this.selectedTablesWithCol = this.selectedTables;
    } else {
      var table: CTable = cloneDeep(event.option);
      table.datasourceTableId = table.id;
      table.codeDatasource = table.codeDatasource;
      table.fullCode = table.codeDatasource + "." + table.code;
      table.id = null;
      this.selectedTables.push(table);
      //this.selectedTablesWithCol.push(event.option);
    }
    this.selectedTablesWithCol = event.value;
    this.buildColumns();
  }

  onColumnClick(event): void {
    this.onEditClick();
    if (this.selectedColumns.find(sc => sc.fullCode === event.option.fullCode)) {
      this.selectedColumns = this.selectedColumns.filter(sc => sc.fullCode !== event.option.fullCode);
    } else {
      var col: CColumn = cloneDeep(event.option);
      col.id = null;
      this.selectedColumns.push(col);
    }
    this.buildColumns();
  }

  buildColumns(): void {
    this.formGroup.get("columns").setValue(this.selectedColumns);
    this.groupColumns = [];
    this.selectedTables.forEach(table => {
      table.columns = [];
      var t = this.tables.find(elem => {
        return elem.fullCode === table.fullCode;
      });
      if (t) {
        let items: any[] = [];
        t.columns.forEach(column => {
          items.push(column);
        });
        this.groupColumns.push({ table: t, items: items });
      }
      setTimeout(() => {
        this.changeRef.markForCheck();
      });
    });
  }

  dislpayFact() {
    return (this.selectedTables.length > 1)
  }

  onChangeFact(table: CTable) {

  }

  onAddClick(): void {
    super.onAddClick();
    this.initForm();
  }

  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(JoinFormComponent, 'Ajouter jointure', this.selectedTablesWithCol, { 'min-width': '800px' }).subscribe((join: CJoin) => {
      //join.parentTableCode = this.incrementTableCode('TO', join.parentTable.code);
      //join.childTableCode = this.incrementTableCode('FROM', join.childTable.code);
      self.selectedData.joins.push(join);
    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(JoinFormComponent, 'Modifier jointure', this.selectedTablesWithCol, { 'min-width': '800px' }).subscribe((join: CJoin) => {
      join.parentTableCode = this.incrementTableCode('TO', join.parentTable.code);
      join.childTableCode = this.incrementTableCode('FROM', join.childTable.code);
      Object.assign(self.selectedChildData, join);
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe((join: CJoin) => {
      if (join) {
        remove(self.selectedData.joins, join);
      }
    });
  }

  incrementTableCode(type: string, tableCode: string): string {
    if (tableCode === this.selectedData.factTable.code) {
      return tableCode;
    }

    var newTableCode: string = tableCode;

    console.log(tableCode);

    var nbr = this.incrementFrom.get(tableCode);
    console.log(nbr);
    if (nbr) {
      //nbr++;
    } else {
      nbr = 1;
    }
    this.incrementFrom.set(tableCode, nbr);
    // TODO uncomment this : newTableCode = newTableCode + nbr;

    if (type === 'TO') {

    }

    if (type === 'FROM') {

    }



    // console.log(newTableCode);
    return newTableCode;
  }

  onSaveClick() {
    if (this.selectedTables.length > 1) {
      this.formGroup.controls['factTable'].setValidators([Validators.required]);
      this.formGroup.controls['factTable'].updateValueAndValidity();
    } else {
      this.formGroup.controls['factTable'].setValue(null);
      this.formGroup.controls['factTable'].clearValidators();
      this.formGroup.controls['factTable'].updateValueAndValidity();
      this.formGroup.controls['joins'].setValue(null);
    }
    this.formGroup.controls['joins'].setValue(this.selectedData.joins);
    this.selectedColumns.forEach(column => {
      var table = this.selectedTables.find(elem => {
        let codeTableFromColumn: string = column.fullCode.substring(0, column.fullCode.lastIndexOf("."));
        return elem.fullCode === codeTableFromColumn;
      });
      if (table) {
        if (!table.columns.find(sc => sc.fullCode === column.fullCode)) {
          table.columns.push(column);
        }
      }
    });
    let namesOfTablesValue: any[] = this.formGroup.get("namesOfTables").value;
    if (namesOfTablesValue && namesOfTablesValue.length) {
      this.selectedTables.forEach((table: CTable) => {
        table.name = namesOfTablesValue.find((t: any) => t.fullCode === table.fullCode)["name"];
      });
    }
    this.formGroup.get("tables").setValue(this.selectedTables);
    super.onSaveClick();
  }

  dislpayCC() {
    return (this.selectedData.id > 0)
  }

  onAddCCClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(CCFormComponent, 'Ajouter colonne calculée', this.selectedTablesWithCol).subscribe((data: CCColumn) => {
      self.selectedData.ccs.push(data);
    });
  }

  onEditCCClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(CCFormComponent, 'Modifier colonne calculée', this.selectedTablesWithCol).subscribe((data: CCColumn) => {
      Object.assign(self.selectedChildData, data);
    });
  }

  onDeleteCCClick() {
    const self = this;
    super.deleteChild().subscribe((data: CCColumn) => {
      if (data) {
        remove(self.selectedData.ccs, data);
      }
    });
  }

}