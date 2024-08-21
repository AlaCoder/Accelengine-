import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { remove } from 'lodash';

// Component
import { HybrideComponent } from 'accelengine-lib';
import { PermissionFormComponent } from '../permission-form/permission-form.component';

// Services
import { RoleService } from '@std/services/role.service';
import { MainMenuService } from '@core/services/mainmenu.service';
import { AccountService } from '@app/accelengine-core/services/account.service';

// Models
import { Menu } from '@core/models/menu.model';
import { Role } from '@core/models/account.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
const log = new Logger('RoleListComponent');

@Component({
  templateUrl: 'role-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class RoleMasterDetailComponent extends HybrideComponent<Role> implements OnInit {

  dataMenus: Menu[] = [];
  columnsMenus: Column[];

  constructor(
    injector: Injector,
    private roleService: RoleService,
    private mainMenuService: MainMenuService,
    private accountService: AccountService
  ) {
    super(injector, Role, roleService, null);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true, width: 300 },
      { field: 'name', header: 'Nom' },
      { field: 'isSupervisor', header: 'Est un superviseur', type: ColumnType.BOOLEAN }
    ]);

    this.columnsChild = Column.fromObjects([
      { field: 'document.code', header: 'Document', filter: true },
      { field: 'action.name', header: 'Action' },
    ]);

    this.columnsMenus = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true },
      { field: 'label', header: 'Libellé', filter: true },
    ]);

    this.pagination = false;
    //this.criteria = true;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      code: [this.selectedData.code, [Validators.required]],
      name: [this.selectedData.name, [Validators.required]],
      isSupervisor: [this.selectedData.isSupervisor, [Validators.required]]
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
    this.subscriptions.push(this.mainMenuService.getAllActivate().subscribe(result => {
      log.debug(result);
      if (result) {
        this.dataMenus = result.datas;
      }
    }));
  }

  // UI Customized Action
  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    this.subscriptions.push(super.addChild(PermissionFormComponent, 'Ajouter Permission').subscribe(permission => {
      self.selectedData.permissions.push(permission);
    }));
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    this.subscriptions.push(super.editChild(PermissionFormComponent, 'Modifier Permission').subscribe(permission => {
      Object.assign(self.selectedChildData, permission);
    }));
  }

  onDeleteChildClick() {
    const self = this;
    this.subscriptions.push(super.deleteChild().subscribe(permission => {
      if (permission) {
        remove(self.selectedData.permissions, permission);
      }
    }));
  }

  onCopyClick(): void {
    this.setIdsToNull(this.selectedData, this.formGroup, ["menus", "action", "document"]);
    super.onCopyClick();
  }

  onDblclickRow(row: Role): void {
    if ((row.code === "ADMIN_SYS" || row.code === "ADMIN_APP") && !this.accountService.isAdminSys()) {
      return;
    }
    super.onDblclickRow(row);
  }
}
