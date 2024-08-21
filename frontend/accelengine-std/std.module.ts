/*
 * STD "version": "2.0.0"
 */
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { StdRoutingModule } from './std-routing.module';

// Components
import { ApplicationDetailComponent } from './pages/application/application-detail/application-detail.component';
import { AccountMasterDetailComponent } from './pages/account/account-master-detail/account-master-detail.component';
import { AccountDetailComponent } from './pages/account/account-detail/account-detail.component';
import { AccountConfigDetailComponent } from './pages/account/account-config-detail/account-config-detail.component';
import { RoleMasterDetailComponent } from './pages/account/role-master-detail/role-master-detail.component';
import { MenuMasterDetailComponent } from './pages/menu/menu-master-detail/menu-master-detail.component';
import { BatchMasterDetailComponent } from './pages/batch/batch-master-detail/batch-master-detail.component';
import { BatchExecutionComponent } from './pages/batch/batch-execution/batch-execution.component';
import { JobMasterDetailComponent } from './pages/job/job-master-detail/job-master-detail.component';
import { ValueFormComponent } from './pages/dictionary/value-form/value-form.component';
import { DictionaryMasterDetailComponent } from './pages/dictionary/dictionary-master-detail/dictionary-master-detail.component';
import { PermissionFormComponent } from './pages/account/permission-form/permission-form.component';

// Monitoring
import { MonitoringDetailComponent } from './pages/monitoring/monitoring-detail.component';
import { JvmMemoryComponent } from './pages/monitoring/blocks/jvm-memory/jvm-memory.component';
import { JvmThreadsComponent } from './pages/monitoring/blocks/jvm-threads/jvm-threads.component';
import { MetricsSystemComponent } from './pages/monitoring/blocks/metrics-system/metrics-system.component';
import { MetricsGarbageCollectorComponent } from './pages/monitoring/blocks/metrics-garbagecollector/metrics-garbagecollector.component';
import { MetricsRequestComponent } from './pages/monitoring/blocks/metrics-request/metrics-request.component';
import { MetricsCacheComponent } from './pages/monitoring/blocks/metrics-cache/metrics-cache.component';
import { MetricsDatasourceComponent } from './pages/monitoring/blocks/metrics-datasource/metrics-datasource.component';
import { MetricsEndpointsRequestsComponent } from './pages/monitoring/blocks/metrics-endpoints-requests/metrics-endpoints-requests.component';
import { HolidayMasterDetailComponent } from './pages/holiday/holiday-master-detail.component';
import { LoginHistoryMasterComponent } from './pages/account/loginhistory-master/loginhistory-master.component';
import { LoggedAccounsMasterComponent } from './pages/account/loggedaccouns-master/loggedaccouns-master.component';
import { ModuleMasterDetailComponent } from './pages/module/module-detail/module-master-detail.component';
import { SettingFormComponent } from './pages/module/setting-form/setting-form.component';
import { LogComponent } from './pages/log/log.component';
import { TranslateMasterDetailComponent } from './pages/translate/translate-master-detail.component';
import { ActionHistoryMasterComponent } from './pages/account/actionhistory-master/actionhistory-master.component';
import { DocumentMasterDetailComponent } from './pages/document/document-master-detail.component';
import { CompanyDetailComponent } from './pages/company/company-detail.component';
import { PrinterMasterDetailComponent } from './pages/printer/printer-master-detail/printer-master-detail.component';
import { AEStatusTypeMasterDetailComponent } from './pages/status/status-type-master-detail/status-type-master-detail.component';
import { AEStatusFormComponent } from './pages/status/status-form/aestatus-form.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';
import { TenantMasterDetailComponent } from './pages/tenant/tenant-master-detail/tenant-master-detail.component';

// Services
import { RoleService } from './services/role.service';
import { BatchService } from './services/batch.service';
import { BatchExecutionService } from './services/batch.execution.service';
import { BatchsWebsocketService } from './services/batchs.websocket.service';
import { JobService } from './services/job.service';
import { HolidayService } from './services/holiday.service';
import { AccountHistoryService } from './services/account-history.service';
import { ModuleService } from './services/module.service';
import { FileExplorerService } from './services/file-explorer.service';
import { DocumentService } from './services/document.service';
import { ActionService } from './services/action.service';
import { CompanyService } from './services/company.service';
import { ActionHistoryService } from './services/action-history.service';
import { PrinterService } from './services/printer.service';
import { TenantService } from './services/tenant.service';
import { AEStatusTypeService } from './services/status-type.service';
import { AEStatusService } from './services/status.service';

@NgModule({
  imports: [
    SharedModule,
    StdRoutingModule,
  ],
  declarations: [
    ApplicationDetailComponent,
    AccountMasterDetailComponent,
    AccountDetailComponent,
    AccountConfigDetailComponent,
    RoleMasterDetailComponent,
    MenuMasterDetailComponent,
    BatchMasterDetailComponent,
    BatchExecutionComponent,
    JobMasterDetailComponent,
    PermissionFormComponent,
    DictionaryMasterDetailComponent,
    ValueFormComponent,
    MonitoringDetailComponent,
    JvmMemoryComponent,
    JvmThreadsComponent,
    MetricsSystemComponent,
    MetricsGarbageCollectorComponent,
    MetricsRequestComponent,
    MetricsCacheComponent,
    MetricsDatasourceComponent,
    MetricsEndpointsRequestsComponent,
    HolidayMasterDetailComponent,
    LoginHistoryMasterComponent,
    LoggedAccounsMasterComponent,
    ModuleMasterDetailComponent,
    SettingFormComponent,
    LogComponent,
    TranslateMasterDetailComponent,
    ActionHistoryMasterComponent,
    DocumentMasterDetailComponent,
    CompanyDetailComponent,
    PrinterMasterDetailComponent,
    OrganizationChartComponent,
    TenantMasterDetailComponent,
    AEStatusTypeMasterDetailComponent,
    AEStatusFormComponent,
    OrganizationChartComponent
  ],
  entryComponents: [
    PermissionFormComponent
  ],
  providers: [
    RoleService,
    BatchService,
    BatchExecutionService,
    BatchsWebsocketService,
    JobService,
    HolidayService,
    AccountHistoryService,
    ModuleService,
    FileExplorerService,
    DocumentService,
    ActionService,
    ActionHistoryService,
    CompanyService,
    PrinterService,
    TenantService,
    AEStatusService,
    AEStatusTypeService
  ]
})

export class StdModule { }
