import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { FC_FLOWCHART, FC_IO, FC_LINK, FC_OPERATOR } from './flowchart.model';
declare var $: any;

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent implements OnInit {

  @Input() set datas(flowchart: FC_FLOWCHART) {
    if (flowchart) {
      if (this.chart && this.chart.nativeElement) {
        $(this.chart.nativeElement).flowchart('setData', {});
      }
      var left = this.cy;
      flowchart.operators.forEach((operator: FC_OPERATOR) => {
        var operatorData = {
          top: this.cx,
          left: left,
          properties: {
            title: operator.properties.title,
            class: operator.properties.class,
            inputs: {},
            outputs: {},
          }
        }

        operator.properties.inputs.forEach((value: FC_IO, key: string) => {
          operatorData.properties.inputs[key] = value;
        });
        operator.properties.outputs.forEach((value: FC_IO, key: string) => {
          operatorData.properties.outputs[key] = value;
        });

        setTimeout(() => {
          $(this.chart.nativeElement).flowchart('createOperator', operator.properties.title, operatorData);
        });

        left = left + 250;
      });

      flowchart.links.forEach((link: FC_LINK) => {
        var linkData = {
          fromOperator: link.fromOperator,
          fromConnector: link.fromConnector,
          toOperator: link.toOperator,
          toConnector: link.toConnector,
        }
        setTimeout(() => {
          $(this.chart.nativeElement).flowchart('addLink', linkData);
        });
      });
    }
  }

  private cx: number;
  private cy: number;
  @ViewChild('chart') chart: ElementRef;

  private config: string;

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    var container = $('#chart_container');
    this.cx = $('#chart').width() / 2;
    this.cy = $('#chart').height() / 2;

    // Zoom
    $('#chart').panzoom({});
    $('#chart').panzoom('pan', -this.cx + container.width() / 2, -this.cy + container.height() / 2);
    var possibleZooms = [0.5, 0.75, 1, 2, 3];
    var currentZoom = 2;
    container.on('mousewheel.focal', function (e) {
      e.preventDefault();
      var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
      var zoomOut: any = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
      $('#chart').flowchart('setPositionRatio', possibleZooms[currentZoom]);
      $('#chart').panzoom('zoom', possibleZooms[currentZoom], {
        animate: false,
        focal: e
      });
    });

    setTimeout(() => {
      $(this.chart.nativeElement).flowchart({
        data: '',
        canUserEditLinks: false,
        multipleLinksOnOutput: true,
      });
    }, 1000);
  }

  getOperatorData($element) {
    var nbInputs = parseInt($element.data('nb-inputs'));
    var nbOutputs = parseInt($element.data('nb-outputs'));
    var data = {
      properties: {
        title: $element.text(),
        inputs: {},
        outputs: {}
      }
    };

    var i = 0;
    for (i = 0; i < nbInputs; i++) {
      data.properties.inputs['input_' + i] = {
        label: 'Input ' + (i + 1)
      };
    }
    for (i = 0; i < nbOutputs; i++) {
      data.properties.outputs['output_' + i] = {
        label: 'Output ' + (i + 1)
      };
    }

    return data;
  }

  deleteOperationOrLink() {
    $(this.chart.nativeElement).flowchart('deleteSelected');
  }

  load() {
    $(this.chart.nativeElement).flowchart('deleteSelected');
    var data = JSON.parse(this.config);
    $(this.chart.nativeElement).flowchart('setData', data);
  }


  get() {
    $(this.chart.nativeElement).flowchart('deleteSelected');
    var data = $(this.chart.nativeElement).flowchart('getData');
    this.config = JSON.stringify(data, null, 2);
  }

}
