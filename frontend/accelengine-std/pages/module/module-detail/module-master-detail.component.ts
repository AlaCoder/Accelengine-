import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Component
import { AECriteria, AECriteriaField, HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { SettingFormComponent } from '../setting-form/setting-form.component';

// Models
import { Module, MODULE_TYPE_LIST } from '@app/accelengine-std/models/application.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { DictionaryValue } from '@app/accelengine-std/models/dictionaryValue.model';

// Services
import { ModuleService } from '@app/accelengine-std/services/module.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { remove } from 'lodash';

const log = new Logger('ModuleMasterDetailComponent');

@Component({
  templateUrl: 'module-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class ModuleMasterDetailComponent extends HybrideComponent<Module> implements OnInit {

  module_type_list = MODULE_TYPE_LIST;

  constructor(
    injector: Injector,
    private moduleService: ModuleService
  ) {
    super(injector, Module, moduleService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'std.field_code' },
      { field: 'name', header: 'std.field_name' },
      { field: 'version', header: 'std.field_version' },
      { field: 'type', header: 'std.field_type', list: MODULE_TYPE_LIST },
      { field: 'expired', header: 'Expired', type: ColumnType.BOOLEAN },
      { field: 'activate', header: 'std.field_active', type: ColumnType.BOOLEAN },
    ]);

    this.columnsChild = Column.fromObjects([
      { field: 'code', header: 'std.field_code' },
      { field: 'name', header: 'std.field_name' },
      { field: 'type', header: 'std.field_type' }
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
      { field: 'code', header: 'std.field_code', value: '' },
      { field: 'name', header: 'std.field_name', value: '' },
      { field: 'version', header: 'std.field_version', value: '' }
    ]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      name: [this.selectedData.name, [Validators.required]],
      version: [this.selectedData.version],
      type: [this.selectedData.type, [Validators.required]],
      stringLicense: [this.selectedData.stringLicense],
      expired: [this.selectedData.expired],
      activate: [this.selectedData.activate],
      settings: [this.selectedData.settings],
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

  onDblclickRow(row: Module) {
    super.onDblclickRow(row);
  }

  // UI Child
  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(SettingFormComponent, this.translateService.instant('std.title_add_settings')).subscribe(data => {
      self.selectedData.settings.push(data);
    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(SettingFormComponent, this.translateService.instant('std.title_update_settings')).subscribe(data => {
      Object.assign(self.selectedChildData, data);
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(data => {
      if (data) {
        remove(self.selectedData.settings, data);
      }
    });
  }
}
