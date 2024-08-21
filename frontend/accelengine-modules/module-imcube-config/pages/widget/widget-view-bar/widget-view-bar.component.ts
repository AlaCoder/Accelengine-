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
  selector: 'app-widget-view-bar',
  templateUrl: './widget-view-bar.component.html',
  styleUrls: ['./widget-view-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewBarComponent implements AfterViewInit {

  @Input() set widget(widget: CWidget) {
    if (widget) {
      this.currentWidget = cloneDeep(widget);
      this.datas = [];
      if(this.currentWidget.id > 0){
        this.idChartContainer = this.currentWidget.id;
      }
      
      setTimeout(() => {
        if (this.currentWidget.datas) {
          this.series = [];
          this.datas = this.currentWidget.datas;
          this.currentWidget.sortColumns.forEach((column: CWidgetColumn) => {
            this.series.push({ type: 'bar' });
          });
          this.buildChart();
        }

      }, 500);
    }
  }

  currentWidget: CWidget;
  datas: any[] = [];
  series: any[] = [];
  idChartContainer : number = 0;

  constructor() {
  }

  ngAfterViewInit() {

  }

  buildChart() {
    var chartDom = document.getElementById("chart-container");
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    option = {
      legend: {},
      tooltip: {},
      dataset: {
        source: this.datas
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value'
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: this.series,
      label: {
        formatter: '{name|{b}} ({d}%)\n{time|{c}}'
      },
    };
    console.log(this.datas);
    option && myChart.setOption(option);
  }

}
