import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsMasterDetailComponent } from './pages/forms/forms-master-detail/forms-master-detail.component';

const routes: Routes = [
  { path: 'forms', component: FormsMasterDetailComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicFormRoutingModule { }
