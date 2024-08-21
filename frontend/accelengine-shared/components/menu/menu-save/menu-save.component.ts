import { Component, Input, Output, EventEmitter } from '@angular/core';


// Services

// Helpers
//import { APP_CONFIG } from '@app/app.config';
//import { Logger } from '@shared/helpers/logger';
//const log = new Logger('MenuSaveComponent');

@Component({
  selector: 'app-menu-save',
  templateUrl: './menu-save.component.html',
  styleUrls: ['./menu-save.component.scss']
})
export class MenuSaveComponent {

  @Input('showSave')
  set showSave(value: boolean) {
    this.save = value;
  }
  @Input() isValide: boolean = false;
  @Input() closeBtnLabel: string = 'label.cancel';
  @Input() saveBtnLabel: string = 'label.save';

  @Output() onSaveClick: EventEmitter<any> = new EventEmitter<any>();

  save: boolean;

  constructor() {
  }

  onSave() {
    this.onSaveClick.emit(true);
  }

  onCancel() {
    this.onSaveClick.emit(false);
  }


}
