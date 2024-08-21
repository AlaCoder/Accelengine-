import { Component, OnInit, Injector } from '@angular/core';

// Component
import { AECriteria, AECriteriaField, AECriteriaType, HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Models
import { AEActionHistory } from '@app/accelengine-std/models/application.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';

// Services
import { ActionHistoryService } from '@app/accelengine-std/services/action-history.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('ActionHistoryMasterComponent');

@Component({
  templateUrl: 'actionhistory-master.component.html',
  animations: APP_CONFIG.app.animations
})
export class ActionHistoryMasterComponent extends HybrideComponent<AEActionHistory> implements OnInit {

  constructor(
    injector: Injector,
    private actionHistoryService: ActionHistoryService,
  ) {
    super(injector, AEActionHistory, actionHistoryService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'entityName', header: 'Document' },
      { field: 'entityId', header: 'Id' },
      { field: 'type', header: 'Action' },
      { field: 'by', header: 'Utilisateur' },
      { field: 'actionDate', header: 'Date', type: ColumnType.DATETIME, format: 'DD/MM/yyyy HH:mm' },
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
      { field: 'entityName', header: 'Document', type: AECriteriaType.STRING, value: '' },
      { field: 'type', header: 'Action', type: AECriteriaType.STRING, value: '' },
      { field: 'by', header: 'Utilisateur', type: AECriteriaType.DATE, value: '' },
    ]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
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

  // UI Customized Action

}
