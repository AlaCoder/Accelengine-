import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DatasourceMasterDetailComponent } from './pages/datasource-master-detail/datasource-master-detail.component';
import { MetadataMasterDetailComponent } from './pages/metadata/metadata-master-detail/metadata-master-detail.component';
import { WidgetMasterDetailComponent } from './pages/widget/widget-master-detail/widget-master-detail.component';
import { DashboardMasterDetailComponent } from './pages/dashboard/dashboard-master-detail/dashboard-master-detail.component';
import { DashboardViewComponent } from './pages/dashboard/dashboard-view/dashboard-view.component';
import { MonitoringMasterDetailComponent } from './pages/monitoring-master-detail/monitoring-master-detail.component';
import { ImportExportComponent } from './pages/import-export/import-export.component';

const routes: Routes = [
  { path: 'datasource', component: DatasourceMasterDetailComponent, data: { title: 'Datasource' } },
  { path: 'metadata', component: MetadataMasterDetailComponent, data: { title: 'Metadata' } },
  { path: 'widget', component: WidgetMasterDetailComponent, data: { title: 'Widget' } },
  { path: 'dashboard', component: DashboardMasterDetailComponent, data: { title: 'Dashboard' } },
  { path: 'dashboard/view/:id', component: DashboardViewComponent, data: { title: 'Datasource View' } },
  { path: 'monitoring', component: MonitoringMasterDetailComponent, data: { title: 'Monitoring' } },
  { path: 'import-export', component: ImportExportComponent, data: { title: 'Import/Export widgets' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImcubeConfigRoutingModule { }
