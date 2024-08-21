import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementFieldConstraintComponent } from './pages/management-constraint/management-constraint.component';
import { ManagementGenericWorkflowComponent } from './pages/management-generic-workflow/management-generic-workflow.component';
import { WorkflowMasterDetailComponent } from './pages/workflow-master-detail/workflow-master-detail.component';

const routes: Routes = [
  { path: 'workflowconfig', component: WorkflowMasterDetailComponent },
  { path: 'workflowconfig/:id', component: WorkflowMasterDetailComponent },
  { path: 'workflowconstraint', component: ManagementFieldConstraintComponent },
  { path: 'workflowgeneric/:code', component: ManagementGenericWorkflowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule {

}
