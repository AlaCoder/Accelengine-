import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-crud',
  templateUrl: './menu-crud.component.html'
})
export class MenuCrudComponent {

  @Input('types')
  set setTypes(value: string) {
    value = value.toLocaleLowerCase();
    this.isAddOK = value.includes('a');
    this.isEditOK = value.includes('e');
    this.isDeleteOK = value.includes('d');
    this.isCopyOK = value.includes('c');
    this.multiple = value.split(",").length > 1;
  }

  @Input() isAddDisabled: boolean = false;
  @Input() isEditDisabled: boolean = false;
  @Input() isDeleteDisabled: boolean = false;
  @Input() isCopyDisabled: boolean = false;

  @Output() addClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() editClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() copyClick: EventEmitter<any> = new EventEmitter<any>();


  public isAddOK: boolean = false;
  public isEditOK: boolean = false;
  public isDeleteOK: boolean = false;
  public isCopyOK: boolean = false;
  public multiple: boolean = false;

  constructor() {
  }

  add() {
    this.addClick.emit(true);
  }

  edit() {
    this.editClick.emit(true);
  }

  delete() {
    this.deleteClick.emit(true);
  }

  copy() {
    this.copyClick.emit(true);
  }
}
