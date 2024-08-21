import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationMenuGuard } from '@app/accelengine-core/guards/authorization-menu.guard';
import { ChangeNotSavedGuard } from '@app/accelengine-core/guards/changenotsaved.guard';

// Components
import { AccountDetailComponent } from './pages/account/account-detail/account-detail.component';
import { AccountConfigDetailComponent } from './pages/account/account-config-detail/account-config-detail.component';
import { AccountMasterDetailComponent } from './pages/account/account-master-detail/account-master-detail.component';
import { RoleMasterDetailComponent } from './pages/account/role-master-detail/role-master-detail.component';
import { ApplicationDetailComponent } from './pages/application/application-detail/application-detail.component';
import { BatchMasterDetailComponent } from './pages/batch/batch-master-detail/batch-master-detail.component';
import { BatchExecutionComponent } from './pages/batch/batch-execution/batch-execution.component';
import { DictionaryMasterDetailComponent } from './pages/dictionary/dictionary-master-detail/dictionary-master-detail.component';
import { JobMasterDetailComponent } from './pages/job/job-master-detail/job-master-detail.component';
import { MenuMasterDetailComponent } from './pages/menu/menu-master-detail/menu-master-detail.component';
import { MonitoringDetailComponent } from './pages/monitoring/monitoring-detail.component';
import { HolidayMasterDetailComponent } from './pages/holiday/holiday-master-detail.component';
import { LoginHistoryMasterComponent } from './pages/account/loginhistory-master/loginhistory-master.component';
import { LoggedAccounsMasterComponent } from './pages/account/loggedaccouns-master/loggedaccouns-master.component';
import { ModuleMasterDetailComponent } from './pages/module/module-detail/module-master-detail.component';
import { LogComponent } from './pages/log/log.component';
import { TranslateMasterDetailComponent } from './pages/translate/translate-master-detail.component';
import { ActionHistoryMasterComponent } from './pages/account/actionhistory-master/actionhistory-master.component';
import { DocumentMasterDetailComponent } from './pages/document/document-master-detail.component';
import { CompanyDetailComponent } from './pages/company/company-detail.component';
import { PrinterMasterDetailComponent } from './pages/printer/printer-master-detail/printer-master-detail.component';
import { AEStatusTypeMasterDetailComponent } from './pages/status/status-type-master-detail/status-type-master-detail.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';
import { TenantMasterDetailComponent } from './pages/tenant/tenant-master-detail/tenant-master-detail.component';


const routes: Routes = [
  { path: 'follow/batch', component: BatchMasterDetailComponent, data: { title: 'Traitements async' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'follow/batch/execution', component: BatchExecutionComponent, data: { title: 'Historique d\'exécution' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'follow/job', component: JobMasterDetailComponent, data: { title: 'Tâches planifiées' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  // access
  { path: 'access/organizationalchart', component: OrganizationChartComponent, data: { title: 'Organization Chart' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'access/account/a/:action', component: AccountMasterDetailComponent, data: { title: 'Comptes' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'access/account/detail', component: AccountDetailComponent, data: { title: 'Profile' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'access/account/config', component: AccountConfigDetailComponent, data: { title: 'Config' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'access/role/a/:action', component: RoleMasterDetailComponent, data: { title: 'Roles' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'access/account/loggedaccount', component: LoggedAccounsMasterComponent, data: { title: 'Login History' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'access/account/loginhistory', component: LoginHistoryMasterComponent, data: { title: 'Login History' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'access/account/actionhistory', component: ActionHistoryMasterComponent, data: { title: 'Internationalisation' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  // param APP
  { path: 'paramapp/company', component: CompanyDetailComponent, data: { title: 'Société' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramapp/holiday', component: HolidayMasterDetailComponent, data: { title: 'Gestion des jours fériés' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramapp/printer', component: PrinterMasterDetailComponent, data: { title: 'Printer' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramapp/dictionary', component: DictionaryMasterDetailComponent, data: { title: 'Dictionnaire de données' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramapp/statustype', component: AEStatusTypeMasterDetailComponent, data: { title: 'Gestion des Status/Priorités ' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  // param SYS
  { path: 'paramsys/application', component: ApplicationDetailComponent, data: { title: 'Application' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramsys/tenant', component: TenantMasterDetailComponent, data: { title: 'Gestion des tenants' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramsys/menu', component: MenuMasterDetailComponent, data: { title: 'Menus' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramsys/module', component: ModuleMasterDetailComponent, data: { title: 'Module' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramsys/translate', component: TranslateMasterDetailComponent, data: { title: 'Internationalisation' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'paramsys/document', component: DocumentMasterDetailComponent, data: { title: 'Documents' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  // monitoring
  { path: 'monitoring', component: MonitoringDetailComponent, data: { title: 'Monitoring' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] },
  { path: 'logs', component: LogComponent, data: { title: 'Téléchargement des journaux' }, canActivate: [AuthorizationMenuGuard], canDeactivate: [ChangeNotSavedGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StdRoutingModule { }
