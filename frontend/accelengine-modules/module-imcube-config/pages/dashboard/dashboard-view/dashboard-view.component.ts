import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Component
import { DetailComponent } from 'accelengine-lib';
import { HttpResponse } from '@angular/common/http';

// Models
import { CDashboard, CDashboardRow } from '../../../models/dashboard.model';
import { CFilter, CWidgetColumn, FILTER_TYPE, WIDGET_TYPE } from '@app/accelengine-modules/module-imcube-config/models/widget.model';
import { COLUMN_TYPE } from '@app/accelengine-modules/module-imcube-config/models/table.model';

// Services
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetService } from '@app/accelengine-modules/module-imcube-config/services/widget.service';

// Components

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { saveAs } from 'file-saver';

const log = new Logger('DashboardMasterDetailComponent');

@Component({
  templateUrl: 'dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class DashboardViewComponent extends DetailComponent<CDashboard> implements OnInit {

  beginDate: Date;
  endDate: Date;
  filters: CWidgetColumn[] = [];
  loadDatas: boolean = false;

  constructor(
    injector: Injector,
    private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private widgetService: WidgetService
  ) {
    super(injector, CDashboard, dashboardService);

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.currentId = Number(params['id']);
        this.initData();
      }
    });

    // UI Customized DataTable

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      beginDate: [this.beginDate],
      endDate: [this.endDate],
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

  afterInitData() {
    log.info('afterInitData');
    this.loadDatas = true;
    setTimeout(() => {
      this.loadDatas = false;
    });
    this.calculateHeightOfAllRows();
  }

  getHeight(row: CDashboardRow): number {
    let mainViewElement = document.getElementById('main-view');
    let height: number = 0;
    if (mainViewElement) {
      let h = mainViewElement.offsetHeight;
      if (this.selectedData.period) {
        h = h - 80;
      } else {
        h = h - 15;
      }
      if (row.height) {
        height = (h * row.height) / 100;
      } else {
        height = ((h * this.restOfHeight()) / 100) / this.numberOfNotMentionedHeight();
      }
    }
    return height;
  }

  calculateHeightOfAllRows(): void {
    setTimeout(() => {
      this.selectedData.rows = this.selectedData.rows.map((row: CDashboardRow) => {
        row.calculatedHeight = this.getHeight(row);
        return row;
      });
    });
  }

  numberOfNotMentionedHeight(): number {
    let numberOfNotMentionedHeight: number = this.selectedData.rows.filter((row: CDashboardRow) => !row.height).length;
    return numberOfNotMentionedHeight !== 0 ? numberOfNotMentionedHeight : 1;
  }

  restOfHeight(): number {
    return 100 - this.sumOfHeight();
  }

  sumOfHeight(): number {
    let initialValue: number = 0;
    const sumWithInitial = this.selectedData.rows.map((row: CDashboardRow) => row.height).filter((height: number) => height).reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initialValue
    );
    return sumWithInitial;
  }

  onChangeDate() {
    this.beginDate = this.formGroup.get('beginDate').value;
    this.endDate = this.formGroup.get('endDate').value;
    log.debug('On Change Date', this.beginDate, this.endDate);

    this.filters = [];
    var i = 0;
    if (this.beginDate) {
      var columnBeginDate: CWidgetColumn = new CWidgetColumn();
      columnBeginDate.code = this.selectedData.dateField;
      columnBeginDate.type = COLUMN_TYPE.DATE;
      let filterBeginDate: CFilter = new CFilter();
      filterBeginDate.type = FILTER_TYPE.GE;
      filterBeginDate.value = this.beginDate.getTime().toString();
      columnBeginDate.filter = filterBeginDate;
      this.filters.push(columnBeginDate);
      i++
    }

    if (this.endDate) {
      var columnEndDate: CWidgetColumn = new CWidgetColumn();
      columnEndDate.code = this.selectedData.dateField;
      columnEndDate.type = COLUMN_TYPE.DATE;
      let filterEndDate: CFilter = new CFilter();
      filterEndDate.type = FILTER_TYPE.LE;
      filterEndDate.value = this.endDate.getTime().toString();
      columnEndDate.filter = filterEndDate;
      this.filters.push(columnEndDate);
      i++;
    }

    if (i > 0) {
      this.loadDatas = true;
      setTimeout(() => {
        this.loadDatas = false;
      });
    }

  }

  displayExportExcel() {
    if (this.selectedData.rows.length == 1 && this.selectedData.rows[0].columns.length == 1) {
      var widget = this.selectedData.rows[0].columns[0].widget;
      if (widget.widgetType == WIDGET_TYPE.TABLE || widget.widgetType == WIDGET_TYPE.PIVOTTABLE || widget.widgetType == WIDGET_TYPE.PIVOTTABLE2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  exportExcel() {

    var widget = this.selectedData.rows[0].columns[0].widget;
    console.log(widget);
    this.subscriptions.push(this.widgetService.exportfromwidgetid(widget.id).subscribe((res: HttpResponse<Blob>) => {
      if (res && res.ok) {
        saveAs(res.body, this.selectedData.code + '.xlsx');
      }
    }));
  }

}