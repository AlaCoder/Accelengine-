import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';

// Model
import { CWidget, CWidgetColumn } from '../../../models/widget.model';

// Service

// Helpers
import { APP_CONFIG } from '@app/app.config';

import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-widget-view-gauge',
  templateUrl: './widget-view-gauge.component.html',
  styleUrls: ['./widget-view-gauge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewGaugeComponent implements AfterViewInit {

  @Input() set widget(widget: CWidget) {
    if (widget) {
      this.currentWidget = cloneDeep(widget);
      this.currentDatas = this.currentWidget.datas;
      setTimeout(() => {
        this.currentWidget.sortRows.forEach((column: CWidgetColumn) => {
          this.buildChart(column);
        });
      }, 500);
    }
  }

  currentWidget: CWidget;
  currentDatas: any[] = [];

  constructor() {
  }

  ngAfterViewInit() {

  }

  buildChart(column: CWidgetColumn) {
    var chartDom = document.getElementById(column.id.toString());
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    var niv1 = Number(column.val3) / Number(column.val2);
    var niv2 = Number(column.val4) / Number(column.val2);
    option = {
      series: [
        {
          type: 'gauge',
          min: Number(column.val1),
          max: Number(column.val2),
          axisLine: {
            lineStyle: {
              width: 5,
              color: [
                [niv1, '#fd666d'],
                [niv2, '#37a2da'],
                [1, '#67e0e3']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'inherit'
            }
          },
          axisTick: {
            distance: -10,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -10,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: 'inherit',
            distance: 10,
            fontSize: 12
          },
          detail: {
            valueAnimation: true,
            formatter: column.name + ' {value}',
            color: 'inherit'
          },
          data: [
            {
              value: this.getRowData(column)
            }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
  }

  getRowData(col) {
    if (col && this.currentWidget.datas) {
      return this.currentWidget.datas[Math.abs(col.id)].toFixed(2);
    }
  }

}
