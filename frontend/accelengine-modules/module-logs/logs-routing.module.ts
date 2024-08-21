import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './pages/logs/logs.component';

const routes: Routes = [
  {
    path: 'logs', component: LogsComponent, data: { title: 'Télécharger Mes Journaux' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }
