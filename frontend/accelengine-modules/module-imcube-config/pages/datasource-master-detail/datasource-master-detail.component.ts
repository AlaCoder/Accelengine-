import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

// Components
import { Column } from '@shared/components/data-table/data-table.model';
import { HybrideComponent, Logger } from 'accelengine-lib';

// Models
import { CDatasource } from '../../models/datasource.model';
import { CTable, CColumn } from '../../models/table.model';

// Services
import { DatasourceService } from '../../services/datasource.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
const log = new Logger('DatasourceMasterDetailComponent');

@Component({
  templateUrl: 'datasource-master-detail.component.html',
  styleUrls: ['./datasource-master-detail.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class DatasourceMasterDetailComponent extends HybrideComponent<CDatasource> implements OnInit {

  databaseTypes: string[] = [];
  masterdata: Map<string, Map<string, string>> = new Map();
  connectionOK: boolean = false;
  activeIndex: number = 0;
  tables: CTable[] = [];
  groupColumns: any[] = [];

  selectedTables: CTable[] = [];
  selectedColumns: CColumn[] = [];

  constructor(
    injector: Injector,
    private datasourceService: DatasourceService,
    private changeRef: ChangeDetectorRef) {
    super(injector, CDatasource, datasourceService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code' },
      { field: 'type', header: 'Type' },
      { field: 'host', header: 'Host' },
      { field: 'port', header: 'Port' },
      { field: 'databaseName', header: 'Database' }
    ]);

    this.pagination = false;
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      type: [this.selectedData.type, [Validators.required]],
      host: [this.selectedData.host, [Validators.required]],
      port: [this.selectedData.port, [Validators.required]],
      databaseName: [this.selectedData.databaseName, [Validators.required]],
      databaseUser: [this.selectedData.databaseUser, [Validators.required]],
      databasePassword: [this.selectedData.databasePassword, [Validators.required]],
      tables: [this.selectedData.tables, [Validators.required]],
      columns: [null, [Validators.required]],
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

    this.masterdata = new Map()
    this.tables = [];
    this.connectionOK = false;
    this.activeIndex = 0;
    this.groupColumns = [];
    this.selectedTables = [];
    this.selectedColumns = [];
  }

  initData() {
    // Do not remove
    super.initData();
    log.debug('Init Data');
    this.datasourceService.getDatabaseTypes().subscribe((results) => {
      if (results) {
        this.databaseTypes = results;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  testConnection() {
    this.datasourceService.testConnection(this.formGroup.value).subscribe(res => {
      if (res !== true) {
      } else {
        this.datasourceService.getMasterdata(this.formGroup.value).subscribe(datas => {
          if (datas) {
            this.masterdata = new Map(Object.entries(datas));
            const tables = Array.from(this.masterdata.keys());
            tables.forEach(table => {
              var t = new CTable();
              t.code = this.formGroup.value.databaseName + '.' + table;
              t.name = table;
              this.tables.push(t);
            });

            this.connectionOK = true;
            setTimeout(() => {
              this.activeIndex = 1;
              if (this.formGroup.value.tables) {
                this.selectedTables = this.formGroup.value.tables;
                this.selectedTables.forEach(table => {
                  table.columns.forEach(column => {
                    this.selectedColumns.push(column);
                  });
                  table.columns = [];
                });
              }
              this.buildColumns();
            });
          }
        });
      }
    });
  }

  onTableClick(event) {
    this.onEditClick();
    if (this.selectedTables.find(sc => sc.code === event.option.code)) {
      this.selectedTables = this.selectedTables.filter(sc => sc.code !== event.option.code);
    } else {
      this.selectedTables.push(event.option);
    }
    this.buildColumns();
  }

  onColumnClick(event): void {
    this.onEditClick();
    if (this.selectedColumns.find(sc => sc.code === event.option.code)) {
      this.selectedColumns = this.selectedColumns.filter(sc => sc.code !== event.option.code);

    } else {
      this.selectedColumns.push(event.option);
    }
    this.buildColumns();
  }

  buildColumns(): void {
    this.formGroup.get("columns").setValue(this.selectedColumns);
    this.groupColumns = [];
    this.selectedTables.forEach(table => {
      let items: any[] = [];
      var columns = new Map(Object.entries(this.masterdata.get(table.code.split('.')[1])));
      columns.forEach((value: string, key: string) => {
        var col = new CColumn();
        col.code = table.code + '.' + key;
        col.name = key;
        col.typeString = value.split(',')[0];
        col.typeInt = value.split(',')[1];
        col.type = col.getType();
        items.push(col);
      });
      this.groupColumns.push({ table: table, items: items });
      this.changeRef.markForCheck();
    });
  }

  onSaveClick() {
    this.selectedColumns.forEach(column => {
      var table = this.selectedTables.find(table => {
        return table.code.split('.')[1] === column.code.split('.')[1];
      });
      if (table) {
        if (table.columns.find(sc => sc.code === column.code)) {
          table.columns = this.selectedColumns.filter(sc => sc.code !== column.code);
        } else {
          table.columns.push(column);
        }
      }
    });
    this.formGroup.get("tables").setValue(this.selectedTables);
    super.onSaveClick();
  }
}