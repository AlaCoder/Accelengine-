import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';

// Model
import { CWidget } from '../../../models/widget.model';

// Service

// Helpers
import { APP_CONFIG } from '@app/app.config';


@Component({
  selector: 'app-widget-view-table',
  templateUrl: './widget-view-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewTableComponent {

  @Input() set widget(widget: CWidget) {
    if (widget) {
      this.currentWidget = cloneDeep(widget);
      this.currentDatas = this.currentWidget.datas;
    }
  }

  currentWidget: CWidget;
  currentDatas: any[] = [];

  constructor() {
  }

  getRowData(rowData, col) {
    if (rowData && col)
      return rowData[col.code]
  }

}
