import { NgModule } from '@angular/core';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { SharedModule } from '@shared/shared.module';

// Components
import { WorkflowMasterDetailComponent } from './pages/workflow-master-detail/workflow-master-detail.component';
import { WorkflowStatusFormComponent } from './pages/workflow-status-form/workflow-status-form.component';
import { WorkflowTransitionFormComponent } from './pages/workflow-transition-form/workflow-transition-form.component';
import { ManagementGenericWorkflowComponent } from './pages/management-generic-workflow/management-generic-workflow.component';
import { WorkflowConstraintFormComponent } from './pages/workflow-constraint-form/workflow-constraint-form.component';
import { ManagementFieldConstraintComponent } from './pages/management-constraint/management-constraint.component';

// Services
import { WorkflowStatusService } from './services/workflow-status.service';
import { TransitionService } from './services/workflow-transition.service';
import { WorkflowHookService } from './services/workflow-hook.service';
import { WorkflowService } from './services/workflow.service';
import { WorkflowDocumentConstraintService } from './services/workflow-document-constraint.service';
import { AEWorkflowService } from '@app/accelengine-core/services/aeworkflow.service';

@NgModule({
  declarations: [
    WorkflowMasterDetailComponent,
    WorkflowStatusFormComponent,
    WorkflowTransitionFormComponent,
    ManagementFieldConstraintComponent,
    WorkflowConstraintFormComponent,
    ManagementGenericWorkflowComponent
  ],
  imports: [
    WorkflowRoutingModule,
    SharedModule
  ],
  providers: [
    WorkflowService,
    WorkflowStatusService,
    TransitionService,
    WorkflowHookService,
    WorkflowDocumentConstraintService,
    AEWorkflowService
  ],
})
export class WorkflowModule { }
