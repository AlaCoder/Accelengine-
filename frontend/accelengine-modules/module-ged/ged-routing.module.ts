import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { FileMasterDetailComponent } from './pages/file/customer-master-detail/file-master-detail.component';

const routes: Routes = [
  {
    path: 'files', component: FileMasterDetailComponent, data: { title: 'Mes fichiers' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GEDRoutingModule { }
