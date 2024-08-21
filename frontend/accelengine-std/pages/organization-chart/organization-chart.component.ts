import { Component, Input, OnInit, Injector } from '@angular/core';

// Component
import { BaseComponent } from 'accelengine-lib';

// Models
import { TreeNode } from 'primeng/api';

// Services
import { AccountService } from '@core/services/account.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('OrganizationChartComponent');
@Component({
  selector: 'app-organization-chart',
  templateUrl: 'organization-chart.component.html',
  animations: APP_CONFIG.app.animations
})
export class OrganizationChartComponent extends BaseComponent implements OnInit {

  @Input() id: number = 0;

  public hierarchicData: TreeNode[];

  constructor(private injector: Injector, private accountService: AccountService) {
    super(injector);
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
  }

  // Init
  initUI() {
    // Do not remove
    log.debug('Init UI');
  }

  initData() {
    this.subscriptions.push(this.accountService.getFiltredAccounts().subscribe((result) => {
      log.debug(result);
      if (result) {
        this.hierarchicData = result.accountTee;
      }
    }));
  }
}
