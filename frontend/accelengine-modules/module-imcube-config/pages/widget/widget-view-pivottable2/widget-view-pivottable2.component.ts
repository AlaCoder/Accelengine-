import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { TreeNode } from 'primeng/api';

// Model
import { CWidget, CWidgetColumn } from '../../../models/widget.model';

// Service

// Helpers
import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-widget-view-pivottable2',
  templateUrl: './widget-view-pivottable2.component.html',
  styleUrls: ['./widget-view-pivottable2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewPivottable2Component {

  @Input() set widget(widget: CWidget) {
    if (widget) {
      if (widget.nodesPath.length == 0) {
        this.currentWidget = cloneDeep(widget);
        this.currentDatas = this.currentWidget.datas;

        let col: CWidgetColumn = new CWidgetColumn();
        col.code = 'key';
        col.name = '';
        this.frozenCols = [];
        this.frozenCols.push(col);

        this.keys = [];
        this.keys.push('key');
        this.pivotHeaderNiv2 = [];
        if (widget.pivotHeaderNiv1)
          widget.pivotHeaderNiv1.forEach(headerNiv1 => {
            if (widget.pivotHeaderNiv2 && widget.pivotHeaderNiv2.length > 0) {
              widget.pivotHeaderNiv2.forEach(headerNiv2 => {
                this.keys.push(headerNiv1 + '-' + headerNiv2);
                this.pivotHeaderNiv2.push(headerNiv2);
              });
            } else {
              this.keys.push(headerNiv1);
            }
          });

      } else {
        var updateNode: TreeNode = null;
        this.currentDatas.forEach((name, index) => {
          if (updateNode === null) {
            updateNode = this.searchTree(this.currentDatas[index], widget.nodesPath[widget.nodesPath.length - 1]);
            if (updateNode !== null) {
              updateNode.children = widget.datas;
              this.currentDatas = [...this.currentDatas];
            }
          }
        });
      }
    }
  }

  @Output() onNodesPathChanged: EventEmitter<any> = new EventEmitter<any>();

  currentWidget: CWidget;
  currentDatas: TreeNode[] = [];
  nodesPath: string[] = [];
  keys: string[] = [];
  pivotHeaderNiv2: string[] = [];
  frozenCols: CWidgetColumn[] = [];

  constructor() {
  }

  ngOnInit() {

  }

  getRowData(rowData, key) {
    if (rowData && key) {
      return rowData[key];
    }
  }

  onNodeExpand(event) {
    this.nodesPath = [];
    var node: TreeNode = event.node;
    this.nodesPath.push(node.data['key']);
    while (node.parent !== null) {
      node = node.parent;
      this.nodesPath.push(node.data['key']);
    }
    this.onNodesPathChanged.emit(this.nodesPath.reverse());
  }

  searchTree(node: TreeNode, key) {
    if (node.data != null && node.data['key'] == key) {
      return node;
    } else if (node.children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < node.children.length; i++) {
        result = this.searchTree(node.children[i], key);
      }
      return result;
    }
    return null;
  }

  getRowspan() {
    if (this.currentWidget.pivotHeaderNiv2 && this.currentWidget.pivotHeaderNiv2.length > 0)
      return 2;
    else
      return 1;
  }

}