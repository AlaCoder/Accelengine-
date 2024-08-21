import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { InputForm } from './input-form';

@Component({
  selector: 'app-tree-select-form',
  templateUrl: './tree-select-form.component.html'
})
export class TreeSelectFormComponent extends InputForm {

  @Input() display: string = "chip" || "comma";
  @Input() scrollHeight: string = "500px";
  @Input() selectionMode: string = "single" || "checkbox" || "multiple";
  @Input() metaKeySelection: boolean = true;
  @Input() values: TreeNode[] = [];

  @Output() onNodeSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }

  nodeSelect(event: any): void {
    let data: any = event["node"]["data"];
    if (data) {
      this.onNodeSelect.emit(event["node"]["data"]);
    }
  }

  nodeUnselect(event: any): void {
    let data: any = event["node"]["data"];
    if (data) {
      this.onNodeUnselect.emit(data);
    }
  }

  onValueChange(event): void {
    event = event.map(e => e.data);
    super.onValueChange(event);
  }
}
