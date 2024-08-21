import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

// Components
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { HybrideComponent } from 'accelengine-lib';

// Services
import { MsgService } from '@core/services/msg.service';
import { HolidayService } from '@std/services/holiday.service';

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { Holiday, HOLIDAY_TYPE, HOLIDAY_TYPE_LIST } from '@std/models/holiday.model';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { compareDate } from '@core/helpers/validators/date.validator';

const log = new Logger('HolidayMasterDetailComponent');

@Component({
  templateUrl: './holiday-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class HolidayMasterDetailComponent extends HybrideComponent<Holiday> implements OnInit {

  constructor(
    injector: Injector,
    private msgService : MsgService,
    private holidayService : HolidayService,
  ) {

    super(injector, Holiday, holidayService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'description', header: 'Description', filter: true },
      { field: 'beginDate', header: 'Date debut', type: ColumnType.DATETIME, format: 'DD/MM/yyyy' , filter: true},
      { field: 'endDate', header: 'Date fin', type: ColumnType.DATETIME, format: 'DD/MM/yyyy' , filter: true},
      { field: 'year', header: 'Année', filter: true, width: 100},
      { field: 'holidayType', header: 'Type', filter: true, list: HOLIDAY_TYPE_LIST , width: 140},
    ]);


    this.pagination = true;
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      description: [this.selectedData.description, [Validators.required]],
      beginDate: [this.selectedData.beginDate, [Validators.required]],
      endDate: [this.selectedData.endDate],
      year: [this.selectedData.year],
      holidayType: [this.selectedData.holidayType]
    }, {
      validators: compareDate('endDate', 'beginDate', '>=', "Date fin", "Date début")
    });
  }

  onSaveClick() {
    this.selectedData.beginDate = this.formGroup.get('beginDate').value;
    this.selectedData.year = new Date(this.selectedData.beginDate).getFullYear();
    this.selectedData.holidayType = HOLIDAY_TYPE.BILLABLE;
    this.formGroup.get('year').setValue(this.selectedData.year);
    this.formGroup.get('holidayType').setValue(this.selectedData.holidayType);
    super.onSaveClick();
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
