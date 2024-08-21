import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { remove, find, filter } from 'lodash';

// Component
import { AECriteriaField, HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { ChildFormComponent } from '../child-form/child-form.component';

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { Father, FATHER_TYPE_LIST } from '../../models/father.model';
import { AECriteriaType } from 'accelengine-lib';
import { ReportParameter, ReportRequestDto } from '@app/accelengine-std/models/report.model';
import { AEFile } from '@app/accelengine-modules/module-ged/models/aefile.model';
import { AEDynamicForm } from 'accelengine-lib';
import { VALUE_TYPE_LIST } from '@app/accelengine-std/models/application.model';

// Services
import { FatherService } from '../../services/father.service';
import { DynamicFormService } from '@app/accelengine-modules/module-dynamic-form/services/dynamic.form.service';
import { ReportService } from '@app/accelengine-std/services/report.service';
import { FileService } from '@app/accelengine-modules/module-ged/services/file.service';
import { DictionaryTypeService } from '@app/accelengine-std/services/dictionary-type.service';
import { SettingService } from '@app/accelengine-std/services/setting.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('FatherMasterDetailComponent');

@Component({
  templateUrl: 'father-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class FatherMasterDetailComponent extends HybrideComponent<Father> implements OnInit {

  public appConfig = APP_CONFIG.app;
  public colors = APP_CONFIG.colors.soft_colors;
  father_type_list = FATHER_TYPE_LIST;
  documents: AEFile[];

  dynamicTypes: AEDynamicForm[] = [];

  // For criteria popup
  criteriasSearchPopup1: AECriteriaField[] = [];
  columnsSearchPopup1: Column[] = [];
  criteriasSearchPopup2: AECriteriaField[] = [];
  columnsSearchPopup2: Column[] = [];
  criteriasSearchPopup3: AECriteriaField[] = [];
  columnsSearchPopup3: Column[] = [];

  constructor(
    injector: Injector,
    private fatherService: FatherService,
    private dynamicFormService: DynamicFormService,
    public reportService: ReportService,
    public fileService: FileService,
    private dictionaryTypeService: DictionaryTypeService,
    private settingService: SettingService
  ) {
    super(injector, Father, fatherService, CriteriaComponent);


    this.currentFileAccept = 'JPG,jpeg,PNG';
    this.currentFileSize = 10000000;

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'string1', header: 'string1', filter: true, sort: true, activateStyleColumn: true, styleColumn: { "color": "red" }, width: 300 },
      { field: 'string4', header: 'string4', filter: true, list: FATHER_TYPE_LIST },
      { field: 'string5', header: 'string5', filter: true, type: ColumnType.LIST },
      { field: 'specialitie.label', header: 'specialitie', filter: true, width: 300 },
      { field: 'specialities', header: 'specialities', filter: true, type: ColumnType.LIST, fieldArray: 'label' },
      { field: 'number4', header: 'number4', filter: true, type: ColumnType.NUMBER, activateStyleColumn: true, styleColumn: { "color": "green" } },
      { field: 'boolean1', header: 'boolean1', filter: true, type: ColumnType.BOOLEAN },
      { field: 'date1', header: 'date1', filter: true, type: ColumnType.DATETIME, format: "DD/MM/YYYY" },
      { field: 'color', header: 'string7', type: ColumnType.COLOR },
      { field: 'priority.label', header: 'priority', type: ColumnType.STATUS },
      { field: 'statusFather.label', header: 'Status', type: ColumnType.STATUS },
    ]);

    this.columnsChild = Column.fromObjects([
      { field: 'name', header: 'Nom' },
      { field: 'details', header: 'Details', buttonLabel: 'view', type: ColumnType.BUTTON }
    ]);

    this.pagination = true;
    this.criteria = true;

    this.criterias = AECriteriaField.fromObjects([
      { field: 'string1', header: 'String 1', operation: '==', value: '', type: AECriteriaType.STRING },
      { field: 'date1', header: 'Date 1', value: '', type: AECriteriaType.DATE },
      { field: 'string4', header: 'String 4', value: '', values: FATHER_TYPE_LIST, type: AECriteriaType.LIST, displayField: 'label', returnValue: 'code' },
      { field: 'specialitie.label', header: 'Specialitié', value: '', type: AECriteriaType.DICTIONARY, typeCode: "RDD" },
      { field: 'number4', header: 'Number 4', value: '', type: AECriteriaType.NUMBER },
    ]);

    /**
     * Init params for popup criteria
     */
    this.criteriasSearchPopup1 = AECriteriaField.fromObjects([
      { field: 'code', header: 'Code', operation: '=CONTAIN=', value: '', type: AECriteriaType.STRING },
      { field: 'label', header: 'Libellé', operation: '=CONTAIN=', value: '', type: AECriteriaType.STRING },
      { field: 'description', header: 'Description', type: AECriteriaType.STRING },
    ]);
    this.columnsSearchPopup1 = Column.fromObjects([
      { field: 'code', header: 'Code', filter: false, sort: true },
      { field: 'label', header: 'Libellé', filter: false },
      { field: 'description', header: 'Description', filter: false },
    ]);
    this.criteriasSearchPopup2 = AECriteriaField.fromObjects([
      { field: 'code', header: 'Code', operation: '=CONTAIN=', value: '', type: AECriteriaType.STRING },
      { field: 'name', header: 'Nom', operation: '=CONTAIN=', value: '', type: AECriteriaType.STRING },
      { field: 'type', header: 'Type', values: VALUE_TYPE_LIST, type: AECriteriaType.LIST, displayField: 'label', returnValue: 'code' },
    ]);
    this.columnsSearchPopup2 = Column.fromObjects([
      { field: 'code', header: 'Code', filter: false },
      { field: 'name', header: 'Nom', filter: false },
      { field: 'type', header: 'Type', filter: false, list: VALUE_TYPE_LIST },
    ]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      string1: [this.selectedData.string1, [Validators.required]],
      string2: [this.selectedData.string2, [Validators.required]],
      string3: [this.selectedData.string3, [Validators.required]],
      string4: [this.selectedData.string4, [Validators.required]],
      string5: [this.selectedData.string5, [Validators.required]],
      string6: [this.selectedData.string6, [Validators.required]],
      string7: [this.selectedData.string7, [Validators.required]],
      number1: [this.selectedData.number1, [Validators.required]],
      number2: [this.selectedData.number2, [Validators.required]],
      number3: [this.selectedData.number3, [Validators.required]],
      number4: [this.selectedData.number4, [Validators.required]],
      boolean1: [this.selectedData.boolean1, [Validators.required]],
      priority: [this.selectedData.priority, [Validators.required]],
      statusFather: [this.selectedData.statusFather, [Validators.required]],
      date1: [this.selectedData.date1, [Validators.required]],
      specialitie: [this.selectedData.specialitie],
      specialities: [this.selectedData.specialities],
      dynamicType: [this.selectedData.dynamicType],
      dynamicFormInputs1: this.formBuilder.array([]),
      dynamicFormInputs2: this.formBuilder.array([]),
      dictionaryType1: [this.selectedData.dictionaryType1, [Validators.required]],
      dictionaryType2: [this.selectedData.dictionaryType2],
      setting: [this.selectedData.setting, [Validators.required]],
      number5: [this.selectedData.number5]
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
  }

  // Init
  initUI() {
    // Do not remove
    super.initUI();
    log.debug('Init UI');
  }

  initData() {
    // Do not remove
    super.initData();
    log.debug('Init Data');
    this.subscriptions.push(this.dynamicFormService.findAllByDocument("Father").subscribe((forms: AEDynamicForm[]) => {
      if (forms && forms.length > 0) {
        this.currentDynamicForm = find(forms, { complementaryFields: true });
        this.dynamicTypes = filter(forms, { complementaryFields: false });
      }
    }));
  }

  onDblclickRow(data: Father) {
    super.onDblclickRow(data);
    this.currentDynamicType = find(this.dynamicTypes, { code: data.dynamicType });
  }

  // UI Child
  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(ChildFormComponent, 'Ajouter Child').subscribe(data => {
      self.selectedData.childs.push(data);
    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(ChildFormComponent, 'Modifier Child').subscribe(data => {
      Object.assign(self.selectedChildData, data);
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(data => {
      if (data) {
        remove(self.selectedData.childs, data);
      }
    });
  }

  onButtonClickEvent(event): void {
    if (event.field === 'details') {
      console.log(event.row);
    }
  }

  onChange(data) {

  }

  report() {
    let reportRequestDto = new ReportRequestDto();
    reportRequestDto.name = "father";
    reportRequestDto.data = [this.selectedData];
    let reportParameter = new ReportParameter();
    reportParameter.name = "title";
    reportParameter.value = "titleFather";
    reportRequestDto.parameters = [reportParameter];
    this.subscriptions.push(this.reportService.createNewPDF(reportRequestDto).subscribe((res: string) => {
      if (res) {
        console.log(res)
        const words = res.split('\\');
        console.log(words[words.length - 1]);
        this.subscriptions.push(this.fileService.createAEFileFromExistingFile(words[words.length - 1]).subscribe((res: AEFile) => {
          if (res) {
            if (!this.selectedData.documents)
              this.selectedData.documents = [];
            this.selectedData.documents.push(res);
            this.subscriptions.push(this.currentService.update(this.selectedData['id'], this.selectedData).subscribe(result => {
              if (result)
                this.selectedData.documents = result.documents
            }))
          }
        }))
      }
    }));
  }

  afterUploadDocumentOK() {
    // specific assignment for each Document
    this.selectedData.image = this.returnFile;
    this.selectedData.documents = this.documents;
    // an update will be executed after this assignment
  }

  selectDocument(file: File) {
    if (file)
      this.currentFile = file;
  }

  selectDocuments(files: AEFile[]) {
    if (files && files.length > 0)
      this.documents = files;
  }

  onChangeDynamicType(dynamicTypeCode: string) {
    this.currentDynamicType = find(this.dynamicTypes, { code: dynamicTypeCode });
  }


  onSaveClick(): void {
    this.blockUiService.blockUI();
    super.onSaveClick();
    setTimeout(() => {
      this.blockUiService.unblockUI();
    }, 1000);
  }
}
