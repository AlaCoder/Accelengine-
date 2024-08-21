import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MailingMasterDetailComponent } from './pages/mailing-master-detail/mailing-master-detail.component';

const routes: Routes = [
  { path: 'outbox', component: MailingMasterDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailingRoutingModule { }
