import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

// Components
import { HybrideComponent, WorkflowStatus } from 'accelengine-lib';
import { CriteriaComponent } from '@app/accelengine-shared/components/criteria/criteria.component';
import { WorkflowConstraintFormComponent } from '../workflow-constraint-form/workflow-constraint-form.component';

//Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { Document } from '@app/accelengine-std/models/application.model';

import { ConstraintFieldDTO, FIELD_TYPE_LIST, Workflow, WorkflowConstraint, WorkflowDocumentConstraint } from '../../models/workflow.model';

//Services
import { WorkflowDocumentConstraintService } from '../../services/workflow-document-constraint.service';
import { WorkflowService } from '../../services/workflow.service';

// Helpers
import { Logger } from 'accelengine-lib';
import { APP_CONFIG } from '@app/app.config';
import { remove } from 'lodash';
import { orderBy } from 'lodash';
import { cloneDeep } from 'lodash';
import { DocumentService } from '@app/accelengine-std/services/document.service';

const log = new Logger('ManagementConstraintsComponent');

@Component({
  selector: 'app-management-constraint',
  templateUrl: './management-constraint.component.html',
  styleUrls: ['./management-constraint.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class ManagementFieldConstraintComponent extends HybrideComponent<WorkflowDocumentConstraint> implements OnInit {
  types = FIELD_TYPE_LIST;
  documents: Document[] = [];
  fileds: ConstraintFieldDTO[] = [];
  filed: ConstraintFieldDTO;
  constraintColumns: Column[];
  constraints: WorkflowConstraint[] = [];
  i: number = -1;
  activeWorkflow: Workflow;
  workflowStatuses: WorkflowStatus[] = [];

  constructor(injector: Injector,
    private workflowDocumentConstraintService: WorkflowDocumentConstraintService,
    private workflowService: WorkflowService,
    private documentService: DocumentService) {
    super(injector, WorkflowDocumentConstraint, workflowDocumentConstraintService, CriteriaComponent);

    this.columns = Column.fromObjects([
      { field: "name", header: "Nom de la Contrainte", filter: true, },
      { field: "document.code", header: "Document", filter: true, },
    ]);

    this.constraintColumns = Column.fromObjects([
      { field: "constraintOrder", header: "ordre", filter: true, },
      { field: "filedName", header: "Attribut", filter: true, },
      { field: "operation", header: "Opération", filter: true, },
      { field: "value", header: "Valeur", filter: true, },
      { field: 'valueDate', header: 'Valeur date', type: ColumnType.DATETIME, format: "DD/MM/YYYY HH:mm" },
      { field: "operator", header: "Opérateur", filter: true, },
    ]);

    this.formGroup = this.formBuilder.group({
      name: [this.selectedData.name, [Validators.required]],
      document: [this.selectedData.document, [Validators.required]],
      failureStatus: [this.selectedData.failureStatus],
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();

    this.subscriptions.push(this.documentService.getAllActivate().subscribe((result) => {
      if (result) {
        this.documents = result.datas;
      }
    }));
  }

  changeDocument(document: Document) {
    this.subscriptions.push(this.workflowDocumentConstraintService.getFiledsByDocument(document.code).subscribe((result) => {
      if (result) {
        this.fileds = result;
      }
      else {
        this.fileds = [];

      }
    }));
    this.subscriptions.push(this.workflowService.findActiveWorkflowByDocumentCode(document.code).subscribe((result: Workflow) => {
      if (result) {
        this.activeWorkflow = result;
        this.workflowStatuses = result.workflowStatuses;
      }
      else {
        this.workflowStatuses = [];
      }
    }));
  }

  changeFiled(element) {
    this.filed = element;
  }

  onSaveClick() {
    log.debug('Save Click HybrideComponent', this.selectedData);
    const self = this;
    const subscribe = this.validation().subscribe(isValid => {
      if (isValid) {
        if (this.selectedData['id'] == null) {
          log.debug('Create');
          this.selectedData.constraints = this.constraints;
          //this.selectedData.type=this.selectedData.filed.filedType;
          const subscribe = this.currentService.create(this.selectedData).subscribe(result => {
            log.debug('Create ok ', result);
            // Do not remove
            if (result) {
              this.selectedData = result;
              this.afterSaveOK();
            }
          });
          self.subscriptions.push(subscribe);
        }
        else {
          log.debug('Update');
          this.selectedData.constraints = this.constraints;
          const subscribe2 = this.currentService.update(this.selectedData['id'], this.selectedData).subscribe(result => {
            // Do not remove
            if (result) {
              this.selectedData = result;
              this.afterSaveOK();
            }
          });
          self.subscriptions.push(subscribe2);
        }
      }
    });
    this.subscriptions.push(subscribe);
  }

  onDblclickRow(row) {
    log.info('onDblclickRow', row);
    this.editMode(false);
    this.canDeleteCopy = true;
    if (this.isMasterExpanded) {
      this.isMasterExpanded = !this.isMasterExpanded;
    }
    this.scrollToDetail();
    if (row['id'] === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "DTO ne contient pas la définition d'une propriété ID" });
    }
    else {
      let subscribe = this.currentService.getByID(row['id']).subscribe(result => {
        log.debug(result);
        if (result) {
          this.selectedData = result;
          this.formGroup.patchValue(this.selectedData);
          this.afterDblclickRow();
        }
      });
      this.subscriptions.push(subscribe);
    }

  }

  onAddChildClick() {
    const self = this;
    super
      .addChild(WorkflowConstraintFormComponent, "Ajouter une Contrainte", { 'fileds': this.fileds })
      .subscribe((constraint: WorkflowConstraint) => {
        this.pushOperationInOrder(this.constraints, constraint)
      })
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    this.changeDocument(this.f.document.value)
    const self = this;
    super.editChild(WorkflowConstraintFormComponent, 'Modifier une Contrainte', { 'operation': this.selectedChildData, 'fileds': this.fileds }).subscribe(value => {
      remove(this.constraints, this.selectedChildData);
      Object.assign(self.selectedChildData, value);
      this.updateOrderInTab(this.constraints);
      this.constraints = orderBy(this.constraints, ['constraintOrder'], ['asc']);
      this.pushOperationInOrder(this.constraints, self.selectedChildData)
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(value => {
      if (value) {
        remove(self.selectedData.constraints, value);
      }
    });
  }

  updateOrderInTab(tab: WorkflowConstraint[]) {
    tab = orderBy(tab, ['constraintOrder'], ['asc']);
    let i = 0;
    tab.forEach(element => {
      i++;
      element.constraintOrder = i;
    })
  }

  pushOperationInOrder(tab: WorkflowConstraint[], operation: WorkflowConstraint) {
    if (tab.length == 0) {
      operation.constraintOrder = 1
      tab.push(operation)
      //alert("djfdjfhjd")
    }
    else {
      if (tab[0].constraintOrder > operation.constraintOrder) {
        tab.forEach(element => {
          element.constraintOrder++;
        })

        operation.constraintOrder = 1;
        tab.unshift(operation);
        //tab.push(operation);
      }
      else if (tab[tab.length - 1].constraintOrder < operation.constraintOrder) {
        operation.constraintOrder = tab.length + 1;
        tab.push(operation);
        //this.selectedData.expression = tab;
      }
      else {
        let newTab: WorkflowConstraint[] = [];
        let i = -1;
        let order = 0;
        let bol = false;
        while (i < tab.length - 1) {
          i++;
          if (tab[i].constraintOrder >= operation.constraintOrder && !bol) {
            bol = true;
            order++;
            operation.constraintOrder = order;
            newTab.push(operation);
            order++;
            tab[i].constraintOrder = order;
            newTab.push(tab[i]);
          }
          else {
            order++;
            tab[i].constraintOrder = order;
            newTab.push(tab[i]);
          }
        }
        this.constraints = newTab;
      }
    }
  }

  onAddClick() {
    log.info('onAddClick');
    this.selectedData = this.factory.create(this.type);
    this.selectedChildData = {};
    this.formGroup.reset();
    this.constraints = [];
    this.editMode(true);
  }
}
