import { Component, OnInit, Injector } from '@angular/core';


// Component
import { AEList, HybrideComponent } from 'accelengine-lib';

// Models
import { TableDTO } from '../../models/table.model';

// Services

// Components
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { CubeDataLoaderService } from '@app/accelengine-modules/module-imcube-config/services/cube-dataloader.service';


const log = new Logger('TableMasterDetailComponent');

@Component({
  templateUrl: 'monitoring-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class MonitoringMasterDetailComponent extends HybrideComponent<TableDTO> implements OnInit {

  backups: any[] = [];
  columns2: any[];

  constructor(
    injector: Injector,
    private cubeDataLoaderService: CubeDataLoaderService
  ) {
    super(injector, TableDTO, cubeDataLoaderService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Nom', width: 400 },
      { field: 'loaded', header: 'Chargé', type: ColumnType.BOOLEAN },
      { field: 'rowNbr', header: 'Nbr de ligne' },
      { field: 'loadTable', header: '', buttonLabel: 'Charger', buttonIcon: 'fa-solid fa-arrow-rotate-right', type: ColumnType.BUTTON, width: 50 },
      { field: 'destroyTable', header: '', buttonLabel: 'Détruire', buttonIcon: 'fa-solid fa-trash-can', type: ColumnType.BUTTON, width: 50 },
      { field: 'backupTable', header: '', buttonLabel: 'Backup', buttonIcon: 'fa-solid fa-file-export', type: ColumnType.BUTTON, width: 50 }
    ]);

    this.columns2 = Column.fromObjects([
      { field: 'code', header: 'Nom', width: 400 },
      { field: 'loaded', header: 'Chargé', type: ColumnType.BOOLEAN },
      { field: 'rowNbr', header: 'Nbr de ligne' },
      { field: 'destroyMetadata', header: '', buttonLabel: 'Détruire', buttonIcon: 'fa-solid fa-trash-can', type: ColumnType.BUTTON, width: 50 },
    ]);

    this.pagination = false;
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      name: [this.selectedData.name],

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
    // super.initData();
    log.debug('Init Data');

    this.subscriptions.push(this.cubeDataLoaderService.getAllDatasourceTables().subscribe(data => {
      if (data) {
        this.datas = data;
      }
    }));
  }

  getTables() {
    var datas: AEList<TableDTO> = new AEList();
    if (this.datas) {
      datas.datas = this.datas.datas.filter(table => table.metadata === false);
      return datas;
    } else {
      datas.datas = [];
      return datas;
    }
  }

  getMetadatas() {
    var datas: AEList<TableDTO> = new AEList();
    if (this.datas) {
      datas.datas = this.datas.datas.filter(table => table.metadata === true);
      return datas;
    } else {
      datas.datas = [];
      return datas;
    }
  }

  onButtonClickEvent(event: any) {
    if (event.field === 'loadTable') {
      this.loadTable(event.row.id);
    }
    if (event.field === 'destroyTable') {
      this.destroyTable(event.row.id);
    }
    if (event.field === 'backupTable') {
      this.backupTable(event.row.id);
    }
    if (event.field === 'destroyMetadata') {
      this.destroyMetadata(event.row.code);
    }
  }

  loadTable(tableID) {
    this.subscriptions.push(this.cubeDataLoaderService.loadTable(tableID).subscribe(data => {
      if (data) {
      }
      this.initUI();
      this.initData();
    }));
  }

  destroyTable(tableID) {
    this.subscriptions.push(this.cubeDataLoaderService.destroyTable(tableID).subscribe(data => {
      if (data) {
      }
      this.initUI();
      this.initData();
    }));
  }

  backupTable(tableID) {
    this.subscriptions.push(this.cubeDataLoaderService.backupTable(tableID).subscribe(data => {
      if (data) {
      }
      this.initUI();
      this.initData();
    }));
  }

  destroyMetadata(metadataName) {
    this.subscriptions.push(this.cubeDataLoaderService.destroyMetadata(metadataName).subscribe(data => {
      if (data) {
      }
      this.initUI();
      this.initData();
    }));
  }

  onDblclickRow(row) {
    if (row.metadata == false) {
      super.onDblclickRow(row);
      this.subscriptions.push(this.cubeDataLoaderService.backups(row.code).subscribe(data => {
        if (data) {
          this.backups = data;
        }
      }));
    }
  }

  loadBackupTable(tableName, fileName) {
    this.subscriptions.push(this.cubeDataLoaderService.loadBackupTable(tableName, fileName).subscribe(data => {
      if (data) {
      }
      this.initUI();
      this.initData();
    }));
  }

}
