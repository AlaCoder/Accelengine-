import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html'
})
export class MenuDetailComponent {

  @Input() showCrud: boolean = true;
  @Input() showResiz: boolean = true;
  @Input() types: string = 'a,e,d,c';

  @Input() isAddDisabled: boolean = false;
  @Input() isEditDisabled: boolean = false;
  @Input() isDeleteDisabled: boolean = false;
  @Input() isCopyDisabled: boolean = false;

  @Output() editClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() copyClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() maximizeClick: EventEmitter<any> = new EventEmitter<any>();

  isMaximize: boolean = true;
  maximizeIcon: string = 'fa fa-compress fa-lg';

  constructor() {
  }

  onEditClick() {
    this.editClick.emit(true);
  }

  onDeleteClick() {
    this.deleteClick.emit(true);
  }
  onCopyClick() {
    this.copyClick.emit(true);
  }

  close() {
    this.closeClick.emit(true);
  }

  maximize() {
    this.isMaximize = !this.isMaximize;
    if (this.isMaximize) {
      this.maximizeIcon = 'fa fa-compress fa-lg';
    } else {
      this.maximizeIcon = 'fa fa-expand fa-lg';
    }
    this.maximizeClick.emit(this.isMaximize);
  }
}
