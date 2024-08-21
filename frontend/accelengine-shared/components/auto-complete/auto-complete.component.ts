import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MenuSaveService } from 'accelengine-lib';
import { AutoComplete } from 'primeng/autocomplete';
import { Observable, Subscription } from 'rxjs';
import { InputForm } from '../forms/input-form';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html'
})
export class AutoCompleteComponent extends InputForm implements OnInit, OnDestroy {

  @ViewChild("autoComplete") autoComplete: AutoComplete;

  @Input() queryObservable: Observable<any[]>;
  @Input() queryFunction: (args: string) => Observable<any[]>;
  @Input() displayField: string;
  @Input() emptyMessage: string = "Pas d'enregistrements";
  @Input() minLength: number = 1;

  subscription: Subscription;
  suggestions: any[] = [];
  entredValue: string;

  oldValue: any = null;

  constructor(private menuSaveService: MenuSaveService) {
    super();
  }

  ngOnInit(): void {

    const subscribe = this.menuSaveService.onClick.subscribe(isSave => {
      if (this.oldValue && !isSave) {
        this.reset(true);
        this.oldValue = null;
      }
    });
    this.subscription = subscribe;
  }

  search(event: any): void {
    if (event?.query) {
      let observable = this.queryFunction(event.query) || this.queryObservable;
      this.subscription = observable?.subscribe((result: any[]) => {
        this.suggestions = result;
      });
    }
  }

  onSelect(event): void {
    if (event) {
      this.formGroup?.get(this.name)?.setValue(event);
      this.oldValue = event;
      this.onChange.emit(event);
    }
  }

  onKeyUp(event): void {
    this.reset(false);
  }

  reset(clear: boolean): void {
    this.formGroup?.get(this.name)?.setValue(null);
    this.onChange.emit(null);
    if (clear) {
      this.entredValue = null;
    }
  }

  getValue(value: FormControl) {
    if (value && value.value !== null && this.displayField) {
      return value.value[this.displayField];
    } else {
      return '';
    }
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
