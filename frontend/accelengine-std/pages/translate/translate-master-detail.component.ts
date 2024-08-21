import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

// Components
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { AECriteria, AECriteriaField, AECriteriaType, HybrideComponent } from 'accelengine-lib';

// Services
import { AETranslateService } from '@app/accelengine-std/services/translate.service';

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { AETranslate } from '@app/accelengine-std/models/translate';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { compareDate } from '@core/helpers/validators/date.validator';


const log = new Logger('TranslateMasterDetailComponent');

@Component({
  templateUrl: './translate-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class TranslateMasterDetailComponent extends HybrideComponent<AETranslate> implements OnInit {

  constructor(
    injector: Injector,
    private aeTranslateService: AETranslateService,
  ) {

    super(injector, AETranslate, aeTranslateService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'language', header: 'Language', filter: true, width: 100 },
      { field: 'codeModule', header: 'Code Module', filter: true, width: 100 },
      { field: 'code', header: 'Code', filter: true, width: 250 },
      { field: 'message', header: 'Message', filter: true },
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
      { field: 'language', header: 'Language', type: AECriteriaType.STRING, value: '' },
      { field: 'codeModule', header: 'Code Module', type: AECriteriaType.STRING, value: '' },
    ]);


    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      language: [this.selectedData.language],
      codeModule: [this.selectedData.codeModule],
      code: [this.selectedData.code],
      message: [this.selectedData.message]
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
}
