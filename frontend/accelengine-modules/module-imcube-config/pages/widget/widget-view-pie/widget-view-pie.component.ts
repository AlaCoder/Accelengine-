import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';

// Model
import { CWidget } from '../../../models/widget.model';

// Service

// Helpers
import { APP_CONFIG } from '@app/app.config';

import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-widget-view-pie',
  templateUrl: './widget-view-pie.component.html',
  styleUrls: ['./widget-view-pie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewPieComponent implements AfterViewInit {

  @Input() set widget(widget: CWidget) {
    if (widget) {
      this.currentWidget = cloneDeep(widget);
      setTimeout(() => {
        if (this.currentWidget.datas)
          this.buildChart();
      }, 500);
    }
  }

  currentWidget: CWidget;
  currentDatas: any[] = [];

  constructor() {
  }

  ngAfterViewInit() {

  }

  buildChart() {
    var chartDom = document.getElementById("chart-container");
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    option = {
      series: [
        {
          name: this.currentWidget.description,
          type: 'pie',
          radius: ['0%', '80%'],
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            focus: 'self'
          },
          label: {
            alignTo: 'edge',
            formatter: '{name|{b}} ({d}%)\n{time|{c}}',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999'
              }
            }
          },
          data: this.currentWidget.datas
        }
      ]
    };
    option && myChart.setOption(option);
  }
}
