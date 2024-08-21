import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ImcubeConfigRoutingModule } from './imcube-config-routing.module';

// Components
import { DatasourceMasterDetailComponent } from './pages/datasource-master-detail/datasource-master-detail.component';
import { MetadataMasterDetailComponent } from './pages/metadata/metadata-master-detail/metadata-master-detail.component';
import { JoinFormComponent } from './pages/metadata/join-form/join-form.component';
import { WidgetMasterDetailComponent } from './pages/widget/widget-master-detail/widget-master-detail.component';
import { WidgetViewComponent } from './pages/widget/widget-view/widget-view.component';
import { DashboardMasterDetailComponent } from './pages/dashboard/dashboard-master-detail/dashboard-master-detail.component';
import { DashboardViewComponent } from './pages/dashboard/dashboard-view/dashboard-view.component';
import { MonitoringMasterDetailComponent } from './pages/monitoring-master-detail/monitoring-master-detail.component';

import { WidgetViewTableComponent } from './pages/widget/widget-view-table/widget-view-table.component';
import { WidgetViewPivottableComponent } from './pages/widget/widget-view-pivottable/widget-view-pivottable.component';
import { WidgetViewPivottable2Component } from './pages/widget/widget-view-pivottable2/widget-view-pivottable2.component';
import { WidgetViewIndicatorComponent } from './pages/widget/widget-view-indicator/widget-view-indicator.component';
import { WidgetViewGaugeComponent } from './pages/widget/widget-view-gauge/widget-view-gauge.component';
import { WidgetViewBarComponent } from './pages/widget/widget-view-bar/widget-view-bar.component';
import { WidgetViewPieComponent } from './pages/widget/widget-view-pie/widget-view-pie.component';

import { ImportExportComponent } from './pages/import-export/import-export.component';
import { CCFormComponent } from './pages/metadata/cc-form/cc-form.component';

// Services
import { DatasourceService } from './services/datasource.service';
import { MetadataService } from './services/metadata.service';
import { WidgetService } from './services/widget.service';
import { TableService } from './services/table.service';
import { CubeDataLoaderService } from './services/cube-dataloader.service';
import { DashboardService } from './services/dashboard.service';


@NgModule({
  imports: [
    SharedModule,
    ImcubeConfigRoutingModule
  ],
  declarations: [
    DatasourceMasterDetailComponent,
    MetadataMasterDetailComponent,
    JoinFormComponent,
    WidgetMasterDetailComponent,
    WidgetViewComponent,
    CCFormComponent,
    //
    WidgetViewTableComponent,
    WidgetViewPivottableComponent,
    WidgetViewPivottable2Component,
    WidgetViewIndicatorComponent,
    WidgetViewGaugeComponent,
    WidgetViewBarComponent,
    WidgetViewPieComponent,

    DashboardMasterDetailComponent,
    DashboardViewComponent,
    MonitoringMasterDetailComponent,
    ImportExportComponent,
  ],
  entryComponents: [
  ],
  providers: [
    DatasourceService,
    MetadataService,
    WidgetService,
    TableService,
    CubeDataLoaderService,
    DashboardService
  ]
})
export class ImcubeConfigModule {

  constructor() {
  }

}
