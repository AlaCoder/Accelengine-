import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';


// Components
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { AEStatusFormComponent } from '../status-form/aestatus-form.component';
import { AECriteriaField, HybrideComponent } from 'accelengine-lib';

// Services
import { DocumentService } from '@app/accelengine-std/services/document.service';
import { AEStatusTypeService } from '../../../services/status-type.service';

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { AEStatusType } from '@app/accelengine-std/models/aestatus-type.model';
import { Document } from '@app/accelengine-std/models/application.model';
import { AEStatus } from '@app/accelengine-std/models/aestatus.model';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { remove } from 'lodash';
import { Logger } from 'accelengine-lib';

const log = new Logger('AEStatusTypeMasterDetailComponent');

@Component({
  templateUrl: './status-type-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class AEStatusTypeMasterDetailComponent extends HybrideComponent<AEStatusType> implements OnInit {

  public colors = APP_CONFIG.colors.colors2;
  documents: Document[] = [];
  isPriorityBol: boolean = false;

  constructor(
    injector: Injector,
    private aeStatusService: AEStatusTypeService,
    private documentService: DocumentService,

  ) {

    super(injector, AEStatusType, aeStatusService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = this.columnsChild = Column.fromObjects([
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Nom' },
      { field: 'document.code', header: 'Document' },
      { field: 'isPriority', header: 'Is priority', type: ColumnType.BOOLEAN },
    ]);
    this.columnsChild = this.columnsChild = Column.fromObjects([
      { field: 'code', header: 'Code' },
      { field: 'label', header: 'Label' },
      //{ field: 'priorityLevel', header: 'Ordre', type: ColumnType.NUMBER, sort: true },
      { field: 'color', header: 'Couleur', type: ColumnType.COLOR },
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
    ]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      code: [this.selectedData.code, [Validators.required]],
      document: [this.selectedData.document, [Validators.required]],
      name: [this.selectedData.name, [Validators.required]],
      isPriority: [this.selectedData.isPriority, [Validators.required]],
    });


  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
    this.subscriptions.push(this.documentService.getAllActivate().subscribe(result => {
      if (result) {
        this.documents = result.datas;
      }
    }));
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
    const self = this;
  }

  // UI Customized Action
  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(AEStatusFormComponent, this.translateService.instant('Ajouter Status'), { isPriority: this.isPriorityBol, status: null }).subscribe((value: AEStatus) => {
      if (value) {
        self.selectedData.statuses.push(value);
      }

    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    const self = this;
    super.editChild(AEStatusFormComponent, this.translateService.instant('Modifier Status'), { isPriority: this.isPriorityBol, status: this.formGroup.value }).subscribe((value: AEStatus) => {
      if (value) {
        Object.assign(self.selectedChildData, value);
      }
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(value => {
      if (value) {
        remove(self.selectedData.statuses, value);
      }
    });
  }

  isPriorityFn(event) {
    this.isPriorityBol = !this.isPriorityBol;
  }

  onDblclickRow(row: AEStatusType) {
    log.info('onDblclickRow', row);

    this.editMode(false);
    this.canDeleteCopy = true;
    if (this.isMasterExpanded) {
      this.isMasterExpanded = !this.isMasterExpanded;
    }
    
    if (row['id'] === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "DTO ne contient pas la définition d'une propriété ID" });
    } else {
      let subscribe = this.currentService.getByID(row['id']).subscribe(result => {
        log.debug(result);
        if (result) {
          this.selectedData = result;
          this.formGroup.patchValue(this.selectedData);
          if (!this.f.isPriority.value)
            this.isPriorityBol = false
          else
            this.isPriorityBol = true
          this.afterDblclickRow();
        }
      });
      this.subscriptions.push(subscribe);
    }
  }

  onAddClick() {
    super.onAddClick();
    this.isPriorityBol = false;
  }
}
