import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { remove } from 'lodash';
import { AECriteria, AECriteriaField } from 'accelengine-lib';
import { HybrideComponent } from 'accelengine-lib';

// Components
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { ValueFormComponent } from '../value-form/value-form.component';

// Services
import { DictionaryTypeService } from '@std/services/dictionary-type.service';

// Models
import { Column } from '@shared/components/data-table/data-table.model';
import { DictionaryType } from '@std/models/dictionaryType.model';
import { DictionaryValue } from '@std/models/dictionaryValue.model';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('DictionaryMasterDetailComponent');

@Component({
  templateUrl: './dictionary-master-detail.component.html',
  styleUrls: ['./dictionary-master-detail.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class DictionaryMasterDetailComponent extends HybrideComponent<DictionaryType> implements OnInit {

  constructor(
    injector: Injector,
    private dictionaryTypeService: DictionaryTypeService
  ) {

    super(injector, DictionaryType, dictionaryTypeService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'std.label_code', filter: true, width: 250 },
      { field: 'label', header: 'std.label_label', filter: true }
    ]);

    this.columnsChild = Column.fromObjects([
      { field: 'code', header: 'std.label_code', filter: true, width: 100 },
      { field: 'label', header: 'std.label_label', filter: true },
      { field: 'description', header: 'std.label_description', filter: true }
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      label: [this.selectedData.label, [Validators.required]],
      description: [this.selectedData.description],
      otherValues: [this.selectedData.otherValues],
      valString1Label: [this.selectedData.valString1Label],
      valString2Label: [this.selectedData.valString2Label],
      valString3Label: [this.selectedData.valString3Label],
      valInt1Label: [this.selectedData.valInt1Label],
      valInt2Label: [this.selectedData.valInt2Label],
      valInt3Label: [this.selectedData.valInt3Label],
      valBool1Label: [this.selectedData.valBool1Label],
      valBool2Label: [this.selectedData.valBool2Label],
      valBool3Label: [this.selectedData.valBool3Label],
      valDate1Label: [this.selectedData.valDate1Label],
      valDate2Label: [this.selectedData.valDate2Label],
      valDate3Label: [this.selectedData.valDate3Label]
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
    const self = this;
  }

  // UI Customized Action
  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(ValueFormComponent, this.translateService.instant('std.title_add_dictionary_value'), this.formGroup.value).subscribe((value: DictionaryValue) => {
      self.selectedData.dictionaryValues.push(value);
    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(ValueFormComponent, this.translateService.instant('std.title_update_dictionary_value'), this.formGroup.value).subscribe(value => {
      Object.assign(self.selectedChildData, value);
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(value => {
      if (value) {
        remove(self.selectedData.dictionaryValues, value);
      }
    });
  }

}
