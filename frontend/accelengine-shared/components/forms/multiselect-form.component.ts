import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { InputForm } from './input-form';


@Component({
  selector: 'app-multiselect-form',
  templateUrl: './multiselect-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectFormComponent extends InputForm {

  @Input() dataKey: string = 'id';
  @Input() values: any[] = [];
  @Input() displayField: string;
  @Input() returnValue: string;
  @Input() group: boolean;
  @Input() emptyFilterMessage: string = "Liste vide !";
  @Input() filter: boolean = true;

  @Output() onShow: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }

  onValuesShow(event): void {
    this.onShow.emit(event);
  }
}
