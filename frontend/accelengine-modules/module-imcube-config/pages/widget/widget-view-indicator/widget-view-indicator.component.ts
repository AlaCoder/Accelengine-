import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';

// Model
import { CWidget } from '../../../models/widget.model';

// Service

// Helpers
import { APP_CONFIG } from '@app/app.config';


@Component({
  selector: 'app-widget-view-indicator',
  templateUrl: './widget-view-indicator.component.html',
  styleUrls: ['./widget-view-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewIndicatorComponent {

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

  getRowData(col) {
    if (col && this.currentWidget.datas) {
      return this.currentWidget.datas[Math.abs(col.id)];
    }
  }

}
