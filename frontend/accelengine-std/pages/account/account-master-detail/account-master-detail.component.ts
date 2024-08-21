import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Component
import { HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Models
import { Account, Role, CIVILITY } from '@core/models/account.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { Menu } from '@app/accelengine-core/models/menu.model';
import { Tenant } from '@app/accelengine-core/models/tenant.model';
import { AECriteriaField, AECriteriaType, AEList } from 'accelengine-lib';

// Services
import { AccountService } from '@core/services/account.service';
import { RoleService } from '@std/services/role.service';
import { MainMenuService } from '@app/accelengine-core/services/mainmenu.service';
import { TenantService } from '@app/accelengine-std/services/tenant.service';

// Helpers
import { PaswordValidator } from '@core/helpers/validators/pasword.validator';
import { APP_CONFIG } from '@app/app.config';

import { Logger } from 'accelengine-lib';

const log = new Logger('AccountListComponent');

@Component({
  templateUrl: 'account-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class AccountMasterDetailComponent extends HybrideComponent<Account> implements OnInit {

  civilitys = CIVILITY;
  public roles: Role[] = [];
  public activatedAccounts: Account[];
  tenants: Tenant[] = [];
  allMenus: Menu[] = [];

  constructor(
    private injector: Injector,
    private accountService: AccountService,
    private roleService: RoleService,
    private tenantService: TenantService,
    private mainMenuService: MainMenuService
  ) {
    super(injector, Account, accountService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'username', header: 'Username' },
      { field: 'email', header: 'Email' },
      { field: 'status', header: 'Est activé', type: ColumnType.BOOLEAN }
    ]);

    this.columnsChild = Column.fromObjects([
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Nom' },
      { field: 'isSupervisor', header: 'Est un superviseur', type: ColumnType.BOOLEAN }
    ]);

    this.pagination = false;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
      { field: 'username', header: 'Username', type: AECriteriaType.STRING, value: '' }
    ]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      username: [this.selectedData.username, [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z0-9]+[._-]?[a-zA-Z0-9]{2,}$")]],
      password: [this.selectedData.password],
      email: [this.selectedData.email, [Validators.email, Validators.required]],
      activate: [this.selectedData.activate, [Validators.required]],
      redirectMenu: [this.selectedData.redirectMenu],
      profile: this.formBuilder.group({
        id: [this.selectedData.profile.id],
        civility: [this.selectedData.profile.civility],
        firstname: [this.selectedData.profile.firstname],
        lastname: [this.selectedData.profile.lastname]
      }),
      contact: this.formBuilder.group({
        id: [this.selectedData.contact.id],
        mainPhone: [this.selectedData.contact.mainPhone, [Validators.min(10000000), Validators.max(99999999)]]
      }),
      supervisorAccount: [this.selectedData.supervisorAccount],
      affectedTenants: [this.selectedData.affectedTenants]
    }, {
      validator: PaswordValidator('id', 'password')
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
    this.subscriptions.push(this.tenantService.getAllActivate().subscribe((res: AEList<Tenant>) => {
      if (res) {
        this.tenants = res.datas;
      }
    }));
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
    this.subscriptions.push(this.roleService.getAllActivate().subscribe((result) => {
      log.debug(result);
      if (result) {
        this.roles = result.datas;
        if (!this.accountService.isAdminSys()) {
          this.roles = this.roles.filter((role: Role) => (role.code !== "ADMIN_SYS" && role.code !== "ADMIN_APP"));
        }
      }
    }));

    this.subscriptions.push(this.mainMenuService.getAllActivate().subscribe((result) => {
      log.debug(result);
      if (result) {
        this.allMenus = result.datas;
        this.allMenus.forEach((menu: Menu) => {
          menu.label = this.translateService.instant(menu.label);
        });
      }
    }));
  }

  afterInitData() {
    if (!this.accountService.isAdminSys()) {
      this.datas.datas = this.datas.datas.filter((account: Account) => (!this.accountService.accountIsAdminSys(account) && !this.accountService.accountIsAdminApp(account)));
    }
  }

  onAddClick(): void {
    super.onAddClick();
    this.subscriptions.push(this.accountService.getAllActivate().subscribe((result) => {
      log.debug(result);
      if (result) {
        this.activatedAccounts = result.datas;
      }
    }));
  }

  afterDblclickRow() {
    if ((this.accountService.accountIsAdminSys(this.selectedData) || this.accountService.accountIsAdminApp(this.selectedData)) && !this.accountService.isAdminSys()) {
      this.onCancelClick();
    } else {
      this.subscriptions.push(this.accountService.getFiltredAccounts(this.selectedData.id, true).subscribe((result) => {
        log.debug(result);
        if (result) {
          this.activatedAccounts = result.accountChildren;
        }
      }));
    }
  }

  // UI Customized Action
  onCopyClick(): void {
    this.setIdsToNull(this.selectedData, this.formGroup, ["roles"]);
    super.onCopyClick();
  }
}
