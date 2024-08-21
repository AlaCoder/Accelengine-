import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Components
import { HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { WorkflowStatusFormComponent } from '../workflow-status-form/workflow-status-form.component';
import { WorkflowTransitionFormComponent } from '../workflow-transition-form/workflow-transition-form.component';

//Models
import { Workflow, WorkflowTransition } from '../../models/workflow.model';
import { Document } from '@app/accelengine-std/models/application.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { WorkflowStatus } from 'accelengine-lib';


//Services
import { WorkflowService } from '../../services/workflow.service';
import { DocumentService } from '@app/accelengine-std/services/document.service';
import { MsgService } from '@app/accelengine-core/services/msg.service';

// Helpers
import { Logger } from 'accelengine-lib';
import { APP_CONFIG } from '@app/app.config';
import { remove } from 'lodash';
import { orderBy } from 'lodash';

const log = new Logger('WorkflowMasterDetailComponent');
@Component({
  selector: 'app-workflow-master-detail',
  templateUrl: './workflow-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class WorkflowMasterDetailComponent extends HybrideComponent<Workflow> implements OnInit {

  appConfig = APP_CONFIG.app;
  documents: Document[] = [];
  columnsTransitions: Column[];
  indexObject: number = 0;

  constructor(injector: Injector,
    private workflowService: WorkflowService,
    private documentService: DocumentService,
    private msgService: MsgService,
    private router: Router,) {

    super(injector, Workflow, workflowService, CriteriaComponent)

    this.pageSize = this.appConfig.pageSize;
    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'name', header: 'Nom' },
      { field: 'document.code', header: 'Document' },
      { field: 'status', header: 'Activé', type: ColumnType.BOOLEAN },
      { buttonLabel: '', type: ColumnType.BUTTON, buttonIcon: 'pi pi-cog' }
    ]);
    this.columnsChild = Column.fromObjects([
      { field: 'code', header: 'Code' },
      { field: 'label', header: 'Label' },
      { field: 'statusOrder', header: 'Ordre', type: ColumnType.NUMBER, sort: true },
      { field: 'color', header: 'Couleur', type: ColumnType.COLOR },
      { field: 'estimation', header: 'Estimation JJ-HH-MM', type: ColumnType.STRING }
    ]);
    this.columnsTransitions = Column.fromObjects([
      { field: 'fromStatus.label', header: 'Source' },
      { field: 'toStatus.label', header: 'Cible' },
      { field: 'roles', header: 'Rôles', fieldArray: 'name', type: ColumnType.LIST },
      { field: 'estimation', header: 'Estimation JJ-HH-MM', type: ColumnType.STRING }
    ]);

    this.pagination = true;

    this.formGroup = this.formBuilder.group({
      name: [this.selectedData.name, [Validators.required]],
      document: [this.selectedData.document, [Validators.required]],
      initialStatus: [this.selectedData.initialStatus, [Validators.required]],
      finalStatus: [this.selectedData.finalStatus, [Validators.required]],
      activate: [this.selectedData.activate, [Validators.required]]
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
    this.subscriptions.push(this.documentService.getAllActivate().subscribe(result => {
      if (result) {
        this.documents = result.datas;
      }
    }));
  }

  onDblclickRow(row: Workflow): void {
    row.workflowStatuses = orderBy(row.workflowStatuses, ['sequenceOrder'], ['asc']);
    super.onDblclickRow(row);
  }

  onCopyClick(): void {
    log.info('onCopyClick');
    this.setIdsToNull(this.selectedData, this.formGroup, ["document", "roles", "hooks"]);
    this.editMode(true);
  }

  // UI Customized Action
  onAddChildClick() {
    log.debug('Add Child Click');
    const self = this;
    super.addChild(WorkflowStatusFormComponent, "Ajouter un statut").subscribe((workflowStatus: WorkflowStatus) => {
      let workflowStatusByCode: WorkflowStatus = self.selectedData.workflowStatuses.find(ws => ws.code === workflowStatus.code);
      if (workflowStatusByCode) {
        this.msgService.showErrorMessage('Erreur', "Le code de statut " + workflowStatus.code + " existe déjà");
      } else {
        this.indexObject--;
        workflowStatus.id = this.indexObject;
        self.selectedData.workflowStatuses.push(workflowStatus);
      }
      self.selectedData.workflowStatuses = orderBy(self.selectedData.workflowStatuses, ['sequenceOrder'], ['asc']);
    });
  }

  onEditChildClick() {
    log.debug('Edit Child Click');
    super.editChild(WorkflowStatusFormComponent, "Modifier un statut").subscribe((workflowStatus: WorkflowStatus) => {
      let workflowStatusByCode: WorkflowStatus = this.selectedData.workflowStatuses.find(ws => ws.code === workflowStatus.code && ws.id !== workflowStatus.id);
      if (workflowStatusByCode) {
        this.msgService.showErrorMessage('Erreur', "Le code de statut " + workflowStatus.code + " existe déjà");
      } else {
        Object.assign(this.selectedChildData, workflowStatus);
        //this.selectedData.workflowStatuses = orderBy(this.selectedData.workflowStatuses, ['sequenceOrder'], ['asc']);
      }
    });
  }

  onDeleteChildClick() {
    const self = this;
    super.deleteChild().subscribe(workflowStatus => {
      if (workflowStatus) {
        let isIntialOrFinal = this.checkInitialAndFinalStatusesBeforDeleteStatus(workflowStatus);
        if (!isIntialOrFinal) {
          this.deleteTransitionAfterDeleteStatus(workflowStatus);
          remove(self.selectedData.workflowStatuses, workflowStatus);
        }
      }
    });
  }

  onAddTransitionClick() {
    log.debug('Add Transition Click');
    const self = this;
    super.addChild(WorkflowTransitionFormComponent, "Ajouter une transition", { workflow: { workflowStatuses: this.selectedData.workflowStatuses, document: this.formGroup.get("document") ? this.formGroup.get("document").value : null } }).subscribe((transition: WorkflowTransition) => {
      transition.code = transition.fromStatus.code + " -> " + transition.toStatus.code;
      if (transition.fromStatus.code === transition.toStatus.code) {
        this.msgService.showErrorMessage('Erreur', "Impossible de faire une transition avec le même statut");
      } else if (self.selectedData.transitions.find((t: WorkflowTransition) => transition.code === t.code)) {
        this.msgService.showErrorMessage('Erreur', "La transition " + transition.fromStatus.label + " -> " + transition.toStatus.label + " existe déjà");
      } else {
        this.indexObject--;
        transition.id = this.indexObject;
        self.selectedData.transitions.push(transition);
      }
    });
  }

  onEditTransitionClick() {
    log.debug('Edit Transition Click');
    const self = this;
    super.editChild(WorkflowTransitionFormComponent, "Modifier un transition", { workflow: { workflowStatuses: this.selectedData.workflowStatuses, document: this.formGroup.get("document") ? this.formGroup.get("document").value : null } }).subscribe((transition: WorkflowTransition) => {
      transition.code = transition.fromStatus.code + " -> " + transition.toStatus.code;
      if (transition.fromStatus.code === transition.toStatus.code) {
        this.msgService.showErrorMessage('Erreur', "Impossible de faire une transition avec le même statut");
      } else if (self.selectedData.transitions.filter((t: WorkflowTransition) => transition.code === t.code).length >= 2) {
        this.msgService.showErrorMessage('Erreur', "La transition " + transition.fromStatus.label + " -> " + transition.toStatus.label + " existe déjà");
      } else {
        Object.assign(self.selectedChildData, transition);
      }
    });
  }

  onDeleteTransitionClick() {
    const self = this;
    super.deleteChild().subscribe(transition => {
      if (transition) {
        remove(self.selectedData.transitions, transition);
      }
    });
  }

  onButtonClickEvent(row) {
    let workflow = row.row
    this.router.navigate(['/workflow/workflowgeneric', workflow.document.code]);
  }


  beforeCreate(): void {
    if (this.selectedData.workflowStatuses) {
      this.updateIdObject(this.selectedData.workflowStatuses);
    }
    if (this.selectedData.transitions) {
      this.updateIdObject(this.selectedData.transitions);
    }
    super.beforeCreate();
  }

  beforeUpdate(): void {
    if (this.selectedData.workflowStatuses) {
      this.updateIdObject(this.selectedData.workflowStatuses);
    }
    if (this.selectedData.transitions) {
      this.updateIdObject(this.selectedData.transitions);
    }
    super.beforeUpdate();
  }

  updateIdObject(objects: any[]) {
    if (objects && objects.length) {
      objects.forEach(element => {
        if (element && element.id && element.id < 0)
          element.id = null
      })
    }
  }

  deleteTransitionAfterDeleteStatus(workflowStatus: WorkflowStatus) {
    let newTransitions: WorkflowTransition[] = [];
    if (this.selectedData && this.selectedData.transitions && this.selectedData.transitions.length > 0) {

      this.selectedData.transitions.forEach((transition: WorkflowTransition) => {
        if (transition.fromStatus.code != workflowStatus.code && transition.toStatus.code != workflowStatus.code) {
          newTransitions.push(transition)
        }
      })
      this.selectedData.transitions = newTransitions
    }
  }

  checkInitialAndFinalStatusesBeforDeleteStatus(workflowStatus: WorkflowStatus): boolean {
    let result: boolean = false;
    if (this.selectedData.initialStatus && workflowStatus &&
      this.selectedData.initialStatus.code == workflowStatus.code) {
      this.msgService.showErrorMessage('Erreur', "Il s'agit d'un statut initial");
      result = true;
    }
    if (this.selectedData.finalStatus && workflowStatus &&
      this.selectedData.finalStatus.code == workflowStatus.code) {
      this.msgService.showErrorMessage('Erreur', "Il s'agit d'un statut final");
      result = true;
    }
    return result;
  }
}
