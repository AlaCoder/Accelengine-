import { Component, OnInit, Injector } from '@angular/core';

// Component
import { AECriteria, AECriteriaField, AECriteriaType, HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Models
import { Account, AEAccountHistory } from '@core/models/account.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';

// Services
import { AccountHistoryService } from '@std/services/account-history.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';



const log = new Logger('LoginHistoryMasterComponent');

@Component({
  templateUrl: 'loggedaccouns-master.component.html',
  animations: APP_CONFIG.app.animations
})
export class LoggedAccounsMasterComponent extends HybrideComponent<AEAccountHistory> implements OnInit {

  constructor(
    injector: Injector,
    private accountHistoryService: AccountHistoryService,
  ) {
    super(injector, Account, accountHistoryService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'username', header: 'std.field_user' },
      { field: 'ip', header: 'std.field_ip' },
      { field: 'info', header: 'std.field_info' },
      { field: 'loginDate', header: 'std.field_connectedAt', type: ColumnType.DATETIME, format: 'DD/MM/yyyy HH:mm' },
      { field: 'logoutDate', header: 'std.field_disconnectedAt', type: ColumnType.DATETIME, format: 'DD/MM/yyyy HH:mm' },
    ]);

    this.pagination = false;
    this.criteria = false;
    this.criterias = AECriteriaField.fromObjects([]);

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
    //super.initData();
    log.debug('Init Data');
    const subscribe = this.accountHistoryService.getLoggedAccouns().subscribe(result => {
      log.debug(result);
      if (result) {
        this.datas = result;
      }
    });
    this.subscriptions.push(subscribe);
  }

  // UI Customized Action

}
