import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { TreeNode } from 'primeng/api';

// Model
import { CWidget, CWidgetColumn } from '../../../models/widget.model';

// Service

// Helpers
import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-widget-view-pivottable',
  templateUrl: './widget-view-pivottable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewPivottableComponent {

  @Input() set widget(widget: CWidget) {
    if (widget) {
      if (widget.nodesPath.length == 0) {
        this.currentWidget = cloneDeep(widget);
        this.currentDatas = this.currentWidget.datas;
        let col: CWidgetColumn = new CWidgetColumn();
        col.code = 'key';
        col.name = '';
        widget.sortRows.forEach((column: CWidgetColumn) => {
          col.name += column.name + '/';
        });
        col.name = col.name.slice(0, -1);
        this.currentWidget.sortColumns.unshift(col);
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

  constructor() {
  }

  ngOnInit() {

  }

  getRowData(rowData, col) {
    if (rowData && col) {
      return rowData[col.code];
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

}