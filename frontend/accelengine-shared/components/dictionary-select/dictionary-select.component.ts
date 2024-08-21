import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { InputForm } from '../forms/input-form';

// Models
import { DictionaryType } from '@std/models/dictionaryType.model';
import { DictionaryValue } from '@std/models/dictionaryValue.model';

// Services
import { DictionaryTypeService } from '@std/services/dictionary-type.service';

@Component({
  selector: 'app-dictionary-select',
  templateUrl: './dictionary-select.component.html',
})
export class DictionarySelectComponent extends InputForm implements OnInit, OnDestroy {

  @Input() dataKey: string = 'id';
  @Input() placeholder: string;
  @Input() displayField: string = 'label';
  @Input() returnValue: string;
  @Input() isSubmitted: boolean = false;
  @Input() isDisabled: boolean;
  @Input() group: boolean;
  @Input() displayLabel: boolean = true;
  @Input() typeCode: string;
  @Input() showClear: boolean = true;
  @Input() autoDisplayFirst: boolean = false;
  @Input() emptyFilterMessage: string = "Liste vide !";
  @Input() filter: boolean = true;
  @Input() codeDefaultDictionaryValue: string = '';

  dictionaryValues: DictionaryValue[] = [];
  subscription: Subscription;

  constructor(private dictionaryTypeService: DictionaryTypeService) {
    super();
  }


  ngOnInit(): void {
    this.subscription = this.dictionaryTypeService.getByCode(this.typeCode).pipe(mergeMap((res: DictionaryType) => {
      if (this.displayLabel) {
        this.label = res.label;
      }
      return this.dictionaryTypeService.findAllValuesByTypeCode(this.typeCode);
    })).subscribe((values: DictionaryValue[]) => {
      this.dictionaryValues = values;
      if (this.codeDefaultDictionaryValue) {
        let dictionaryValue: DictionaryValue = this.dictionaryValues.find((dictionaryValue: DictionaryValue) => dictionaryValue.code === this.codeDefaultDictionaryValue);
        this.formGroup.get(this.name).setValue(dictionaryValue);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
