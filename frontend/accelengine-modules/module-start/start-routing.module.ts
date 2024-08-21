import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { FatherMasterDetailComponent } from './pages/father-master-detail/father-master-detail.component';

const routes: Routes = [
  { path: 'father/a/:action', component: FatherMasterDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
