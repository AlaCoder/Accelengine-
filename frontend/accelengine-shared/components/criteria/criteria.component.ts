import { Component, OnInit, Injector, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

// Component
import { AECriteria, AECriteriaField, FormPopupComponent } from 'accelengine-lib';

// Models
import { Account } from '@app/accelengine-core/models/account.model';
import { CodeNameEntity, AECriteriaType } from 'accelengine-lib';

//Services
import { StorageService } from '@app/accelengine-core/services/storage.service';
import { CriteriaSubmitService } from '@app/accelengine-core/services/criteria-submit.service';

// Helpers
import { Logger } from 'accelengine-lib';
import { PersonalCriteriaService } from '@app/accelengine-core/services/personal-criteria.service';
import { PersonalCriteria } from '@app/accelengine-core/models/personal-criteria.model';


const log = new Logger('CriteriaComponent');

@Component({
  selector: 'app-criteria',
  templateUrl: 'criteria.component.html',
  styleUrls: ['criteria.component.scss'],
})
export class CriteriaComponent extends FormPopupComponent<AECriteriaField> implements OnInit {

  @Input() storable: boolean = true;
  @Input() data: any;
  @Output() onSubmitClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onResetClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancelClick: EventEmitter<any> = new EventEmitter<any>();

  stringOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '=CONTAIN=', name: 'Contient' },
    { code: '=NOTCONTAIN=', name: 'Ne contient pas' },
    { code: '==', name: 'Égal à' },
    { code: '!=', name: 'N\'est pas égal à' },
    { code: '=BEGINWITH=', name: 'Commence par' },
    { code: '=NOTBEGINWITH=', name: 'Ne commence pas par' },
    { code: '=ENDWITH=', name: 'Se terminant par' },
    { code: '=NOTENDWITH=', name: 'Ne se terminant pas par' }
  ]);

  numberOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '==', name: 'Égal à' },
    { code: '!=', name: 'N\'est pas égal à' },
    { code: '<', name: 'Inférieur à' },
    { code: '<=', name: 'Inférieur ou égal à' },
    { code: '>', name: 'Supérieur à' },
    { code: '>=', name: 'Supérieur ou égal à' }
  ]);

  listOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '==', name: 'Égal à' },
    { code: '!=', name: 'N\'est pas égal à' }
  ]);

  dateOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '==', name: 'Égal à' },
    { code: '!=', name: 'N\'est pas égal à' },
    { code: '<', name: 'Inférieur à' },
    { code: '<=', name: 'Inférieur ou égal à' },
    { code: '>', name: 'Supérieur à' },
    { code: '>=', name: 'Supérieur ou égal à' }
  ]);

  allOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '==', name: 'Égal à' },
    { code: '=BEGINWITH=', name: 'Commence par' },
    { code: '=ENDWITH=', name: 'Se terminant par' },
    { code: '=CONTAIN=', name: 'Contient' },
    { code: '!=', name: 'N\'est pas égal à' },
    { code: '=NOTBEGINWITH=', name: 'Ne commence pas par' },
    { code: '=NOTENDWITH=', name: 'Ne se terminant pas par' },
    { code: '=NOTCONTAIN=', name: 'Ne contient pas' },
    { code: '<', name: 'Inférieur à' },
    { code: '<=', name: 'Inférieur ou égal à' },
    { code: '>', name: 'Supérieur à' },
    { code: '>=', name: 'Supérieur ou égal à' }
  ]);

  multiselectOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '=in=', name: 'Appartient' },
    { code: '=out=', name: 'N\'appartient pas' }
  ]);

  booleanOperations: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: '==', name: 'Égal à' },
    { code: '!=', name: 'N\'est pas égal à' }
  ]);

  getOperations(index: number) {
    const criteriaField: AECriteriaField = this.getCriteriaFormAt(index).value;
    if (criteriaField.customOperations) {
      return criteriaField.customOperations;
    }
    switch (criteriaField.type) {
      case AECriteriaType.NUMBER: {
        return this.numberOperations;
      }
      case AECriteriaType.DATE: {
        return this.dateOperations;
      }
      case AECriteriaType.STRING: {
        return this.stringOperations;
      }
      case AECriteriaType.LIST:
      case AECriteriaType.DICTIONARY: {
        return this.listOperations;
      }
      case AECriteriaType.MULTISELECT: {
        return this.multiselectOperations;
      }
      case AECriteriaType.BOOLEAN: {
        return this.booleanOperations;
      }
      default: {
        return this.allOperations;
      }
    }
  }

  logicalNodes: CodeNameEntity[] = CodeNameEntity.fromObjects([
    { code: ';', name: 'ET' },
    { code: ',', name: 'OU' }
  ]);

  headers: CodeNameEntity[] = [];

  personalCriteriaId: number;
  current_account: Account;
  current_menu_code: string;
  current_criterias: any[];

  criteriaForm!: FormGroup;
  criteriaData!: FormArray;
  controls!: FormArray;

  possibleCriterias: AECriteriaField[];
  selectedCriteria: AECriteriaField;

  constructor(
    private injector: Injector,
    private personalCriteriaService: PersonalCriteriaService,
    private storageService: StorageService,
    private criteriaSubmitService: CriteriaSubmitService,
    private cdr: ChangeDetectorRef
  ) {
    super(injector, AECriteriaField);
  }

  ngOnInit(): void {
    if (this.data) {
      this.possibleCriterias = this.data['criterias'];
      this.selectedCriteria = this.possibleCriterias[0];
      this.getHeaders();
    }
    log.info('ngOnInit ', this.possibleCriterias);
    this.criteriaForm = this.formBuilder.group({
      id: [''],
      logicalNode: [';'],
      criteriaData: this.formBuilder.array([])
    });
    this.initAECriteria();
  }

  getHeaders() {
    this.possibleCriterias.forEach(possibleCriteria => {
      this.headers.push(
        CodeNameEntity.fromObject(
          { code: possibleCriteria.field, name: possibleCriteria.header }
        )
      )
    })
  }

  initAECriteria() {
    log.info("initAECriteria", this.storable);
    this.current_account = this.storageService.getCurrentAccount();
    this.current_menu_code = this.storageService.get(StorageService.CURRENT_MENU_CODE);
    if (this.storable && this.current_account && this.current_menu_code) {
      this.personalCriteriaService.getByCodeMenuAndAccountId(this.current_menu_code, this.current_account.id).then((personalCriteria: PersonalCriteria) => {
        if (personalCriteria) {
          this.personalCriteriaId = personalCriteria.id;
          this.criteriaForm.get('id').setValue(personalCriteria.criteria.id);
          this.criteriaForm.get('logicalNode').setValue(personalCriteria.criteria.logicalNode);
          this.criterias = personalCriteria.criteria.criteriaFields.map((criteria) => AECriteriaField.fromObject(criteria));
          this.criteriaData = this.criteriaForm.get('criteriaData') as FormArray;
          this.criterias.forEach((criteria, index) => {
            this.selectedCriteria = this.possibleCriterias.find(x => x.field === criteria.field);
            this.criteriaData.insert(index, this.createCriteria());
            const control = this.getCriteriaFormAt(index);
            control.get('id').setValue(criteria.id);
            control.get('value').setValue(criteria.stringValue);
            control.get('operation').setValue(criteria.operation);
            if (this.selectedCriteria.type === 6) {
              control.get('value').setValue(control.get('value').value === 'true' ? true : false);
            }
            // if(this.selectedCriteria.type === 4){
            //   let val = this.selectedCriteria.values.find(x => x.code === control.get('value').value);
            //   control.get('value').setValue(val.code);
            // }
          });
        } else {
          this.addCriteria(0);
        }
      });
    } else {
      this.addCriteria(0);
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  createCriteria(): FormGroup {
    return this.formBuilder.group({
      id: [],
      field: [this.selectedCriteria.field],
      header: [this.selectedCriteria.header],
      operation: [this.selectedCriteria.operation],
      type: [this.selectedCriteria.type],
      value: [this.selectedCriteria.value],
      typeCode: [this.selectedCriteria.typeCode],
      dateFormat: [this.selectedCriteria.dateFormat],
      values: [this.selectedCriteria.values],
      displayField: [this.selectedCriteria.displayField],
      returnValue: [this.selectedCriteria.returnValue],
      dataKey: [this.selectedCriteria.dataKey],
      customOperations: [this.selectedCriteria.customOperations]
    });
  }

  addCriteria(index: number): void {
    this.criteriaData = this.criteriaForm.get('criteriaData') as FormArray;
    this.selectedCriteria = this.possibleCriterias[0];
    this.criteriaData.insert(index, this.createCriteria());
  }

  deleteCriteria(index: number) {
    const control = this.criteriaForm.get('criteriaData') as FormArray;
    control.removeAt(index);
  }

  get getFormControls() {
    const control = this.criteriaForm.get('criteriaData') as FormArray;
    return control;
  }

  getCriterias() {
    return (<FormArray>this.criteriaForm.get('criteriaData')).controls;
  }

  getCriteriaFormAt(i: number): AbstractControl {
    return (<FormArray>this.criteriaForm.get('criteriaData')).at(i);
  }

  selectCriteria(index: number) {
    const control = this.getCriteriaFormAt(index);
    this.selectedCriteria = this.possibleCriterias.find(x => x.field === control.value.field);
    control.patchValue(this.selectedCriteria);
  }

  onSubmit(): void {
    let personalCriteria: PersonalCriteria = this.createPersonalCriteria();
    if (this.storable) {
      const sub = this.personalCriteriaService.save(personalCriteria).subscribe(
        (res) => {
          if (res) {
            this.criteriaSubmitService.criteriaSubmit.next(true);
            super.onSubmit();
          }
        },
        err => {
          super.onSubmit();
        });
      this.subscriptions.push(sub);
    } else {
      this.onSubmitClick.emit(personalCriteria);
      super.onSubmit();
    }
  }

  createPersonalCriteria() {
    let personalCriteria = new PersonalCriteria();
    personalCriteria.id = this.personalCriteriaId;
    personalCriteria.codeMenu = this.current_menu_code;
    personalCriteria.account = new Account();
    personalCriteria.account.id = this.current_account.id;
    personalCriteria.criteria = new AECriteria();
    personalCriteria.criteria.id = this.criteriaForm.value.id;
    personalCriteria.criteria.logicalNode = this.criteriaForm.value.logicalNode;
    let criteriaFields: AECriteriaField[] = this.getCriterias().map((res) =>
      AECriteriaField.fromObject(
        {
          id: res.get('id').value,
          field: res.get('field').value,
          operation: res.get('operation').value,
          value: res.get('value').value,
          stringValue: res.get('value').value
        }
      ));
    personalCriteria.criteria.criteriaFields = criteriaFields;
    return personalCriteria;
  }

  onReset(): void {
    this.criteriaForm.get('logicalNode').setValue(';');
    (this.criteriaForm.get('criteriaData') as FormArray).clear();
    this.onResetClick.emit(true);
    this.addCriteria(0);
  }

  onCancel(): void {
    super.onCancel();
    this.onCancelClick.emit(true);
  }

}
