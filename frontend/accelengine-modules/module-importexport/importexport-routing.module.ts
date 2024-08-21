import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { FileParamMasterDetailComponent } from './pages/fileparam-master-detail/fileparam-master-detail.component';
import { ImportComponent } from './pages/import/import.component';

const routes: Routes = [
  { path: 'file', component: FileParamMasterDetailComponent },
  { path: 'import', component: ImportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportexportRoutingModule { }
