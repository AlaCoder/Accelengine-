import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { InputForm } from './input-form';
import { FormControl } from '@angular/forms';
import { filter } from 'lodash';

// Helpers
//import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFormComponent extends InputForm {

  @Input() dataKey: string = 'id';
  @Input() values: any[] = [];
  @Input() displayField: string;
  @Input() returnValue: string;
  @Input() group: boolean;
  @Input() showClear: boolean = true;
  @Input() autoDisplayFirst: boolean = false;
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
