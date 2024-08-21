import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

// Components
import { FormPopupComponent, WorkflowStatus } from 'accelengine-lib';

// Models

import { Role } from '@app/accelengine-core/models/account.model';
import { WorkflowDocumentConstraint, WorkflowHook, WorkflowTransition } from '../../models/workflow.model';


// Services
import { RoleService } from '@std/services/role.service';
import { WorkflowHookService } from '../../services/workflow-hook.service';
import { WorkflowDocumentConstraintService } from '../../services/workflow-document-constraint.service';


// Helpers
import { Logger } from 'accelengine-lib';

const log = new Logger('WorkflowTransitionFormComponent');

@Component({
  selector: 'app-workflow-transition-transition-form',
  templateUrl: './workflow-transition-form.component.html',
  providers: [WorkflowHookService, WorkflowDocumentConstraintService]
})
export class WorkflowTransitionFormComponent extends FormPopupComponent<WorkflowTransition> implements OnInit {

  roles: Role[] = [];
  workflowStatuses: WorkflowStatus[] = [];
  hooks: WorkflowHook[] = [];
  constraints: WorkflowDocumentConstraint[] = [];

  constructor(injector: Injector,
    private roleService: RoleService,
    private workflowHookService: WorkflowHookService,
    private workflowDocumentConstraintService: WorkflowDocumentConstraintService) {

    super(injector, WorkflowTransition);
    this.formGroup = this.formBuilder.group({
      id: [this.data.id],
      fromStatus: [this.data.fromStatus, [Validators.required]],
      toStatus: [this.data.toStatus, [Validators.required]],
      roles: [this.data.roles, [Validators.required]],
      hooks: [this.data.hooks],
      constraint: [this.data.constraint],
      automaticTransition: [this.data.automaticTransition],
      commentIsRequired: [this.data.commentIsRequired],
      estimation: [this.data.estimation, [Validators.pattern("^[0-9]+\-([0-2][0-3]|[0-1][0-9])\-[0-5][0-9]")]]
    });
  }

  ngOnInit(): void {
    log.info('ngOnInit TransitionFormComponent', this.data);
    this.subscriptions.push(this.roleService.getAllActivate().subscribe((result) => {
      if (result) {
        this.roles = result.datas;
      }
    }));
    if (this.param && this.param.workflow) {
      this.workflowStatuses = this.param.workflow.workflowStatuses;
      if (this.param.workflow.document && this.param.workflow.document.id) {
        this.subscriptions.push(this.workflowHookService.findAllByDocument(this.param.workflow.document.id).subscribe((res: WorkflowHook[]) => {
          this.hooks = res;
        }));
        this.subscriptions.push(this.workflowDocumentConstraintService.getFiledConstraintsByDocument(this.param.workflow.document.code).subscribe((res: WorkflowDocumentConstraint[]) => {
          this.constraints = res;
        }));
      }
    }
    if (this.data) {
      this.formGroup.patchValue(this.data);
    };
  }
}
