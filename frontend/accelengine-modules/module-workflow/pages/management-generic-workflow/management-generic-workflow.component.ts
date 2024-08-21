import { Component, Injector, OnInit } from '@angular/core';
import { HybrideComponent } from 'accelengine-lib';

// Components
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

//Models
import { Account } from '@core/models/account.model';
import { Workflow } from '../../models/workflow.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { AEWorkflow, WorkflowStatus } from 'accelengine-lib';
import { WorkflowHistory } from '../../models/workflowHistory.model';

//Services
import { WorkflowService } from '../../services/workflow.service';
import { AEWorkflowService } from '@core/services/aeworkflow.service';

// Helpers
const log = new Logger('ManagementGenericWorkflowComponent');
import { APP_CONFIG } from '@app/app.config';
import { cloneDeep } from 'lodash';
import { Logger } from 'accelengine-lib';
import { mergeMap, of } from 'rxjs';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-management-generic-workflow',
  templateUrl: './management-generic-workflow.component.html',
  styleUrls: ['./management-generic-workflow.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class ManagementGenericWorkflowComponent extends HybrideComponent<AEWorkflow> implements OnInit {
  objectsWorkflow: AEWorkflow[] = [];
  idWorkflow: number;
  workflow: Workflow;
  newStatusToUpdate: WorkflowStatus;
  code: string;
  columnsHistory: Column[];
  valueHistory: WorkflowHistory[] = [];
  currentAccount: Account;

  constructor(injector: Injector,
    public aeWorkflowService: AEWorkflowService,
    private workflowService: WorkflowService) {

    super(injector, AEWorkflow, aeWorkflowService, CriteriaComponent);
    this.columns = Column.fromObjects([
      { field: 'id', header: 'Id' },
      { field: 'code', header: 'Code' },
      { field: 'oldStatus.label', header: 'Statut précédent' },
      { field: 'newStatus.label', header: 'Statut Courant' },
    ]);

    this.formGroup = this.formBuilder.group({
      detailsNewStatus: [this.selectedData.oldStatus, [Validators.required]],
      newStatus: [this.selectedData.newStatus, [Validators.required]]
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.columnsHistory = Column.fromObjects([
      { field: 'initialStatus', header: 'De' },
      { field: 'finalStatus', header: 'Vers' },
      { field: 'executor.profile.fullname', header: 'Account' },
      { field: 'date', header: 'Date', type: ColumnType.DATETIME, format: "DD/MM/YYYY HH:mm" },
    ]);

    this.activatedRoute.params.pipe(mergeMap((params) => {
      if (params["code"]) {
        this.code = params["code"];
        return this.workflowService.findActiveWorkflowByDocumentCode(this.code)
      }
      return of(null);
    })).subscribe((result: Workflow): void => {
      if (!result) {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Document non trouvé" });
        this.objectsWorkflow = [];
      }
      else {
        this.workflow = result;
        this.subscriptions.push(this.aeWorkflowService.getObject(this.workflow.id).subscribe((result: AEWorkflow[]) => {
          if (result) {
            this.objectsWorkflow = result;
          }
        }));
      }
    });
  }

  onDblclickRow(row) {
    log.info('onDblclickRow', row);
    this.editMode(false);
    this.canDeleteCopy = true;
    if (this.isMasterExpanded) {
      this.isMasterExpanded = !this.isMasterExpanded;
    }
    this.scrollToDetail();
    this.selectedData = cloneDeep(row);
    this.subscriptions.push(this.aeWorkflowService.findHistory(this.selectedData.id).subscribe((result: WorkflowHistory[]) => {
      if (result) {
        this.valueHistory = result;
      }
    }));
    this.afterDblclickRow();
  }

  onSaveClick() {
    log.debug('Save Click HybrideComponent', this.selectedData);
    const self = this;
    log.debug('Update');
    const subscribe = this.validation().subscribe(isValid => {
      if (isValid) {
        const subscribe2 = this.aeWorkflowService.updateNewStatus(this.selectedData.id, this.selectedData).subscribe(result => {
          // Do not remove
          if (result) {
            this.afterSaveOK();
            this.subscriptions.push(this.aeWorkflowService.getObject(this.workflow.id).subscribe((result: AEWorkflow[]) => {
              if (result) {
                this.objectsWorkflow = result;
              }
            }));
          }
        });
        self.subscriptions.push(subscribe2);
      }
    });
    this.subscriptions.push(subscribe);
  }

  receptionOfNewStatus(data: WorkflowStatus) {
    this.newStatusToUpdate = data;
  }
}
