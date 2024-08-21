import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthorizationMenuGuard } from '@core/guards/authorization-menu.guard';

// Component
import { AppMainComponent } from './accelengine-verona/app.main.component';
import { AppNotfoundComponent } from './accelengine-verona/pages/app.notfound.component';
import { AppUnderMaintenanceComponent } from './accelengine-verona/pages/app.maintenance.component';
import { AppLoginComponent } from './accelengine-verona/pages/app.login.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            {
                path: '', component: AppMainComponent,
                children: [
                    { path: 'std', loadChildren: () => import('@std/std.module').then(m => m.StdModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'ged', loadChildren: () => import('@modules/module-ged/ged.module').then(m => m.GEDModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'dashboard', loadChildren: () => import('@modules/module-dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'start', loadChildren: () => import('@modules/module-start/start.module').then(m => m.StartModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'dynamicform', loadChildren: () => import('@modules/module-dynamic-form/dynamic-form.module').then(m => m.DynamicFormModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'importexport', loadChildren: () => import('@modules/module-importexport/importexport.module').then(m => m.ImportexportModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'imcube/config', loadChildren: () => import('@modules/module-imcube-config/imcube-config.module').then(m => m.ImcubeConfigModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'workflow', loadChildren: () => import('@modules/module-workflow/workflow.module').then(m => m.WorkflowModule), canActivate: [AuthorizationMenuGuard] },
                    { path: 'mailing', loadChildren: () => import('@app/accelengine-modules/module-mailing/mailing.module').then(m => m.MailingModule), canActivate: [AuthorizationMenuGuard] },
                    { path: '', loadChildren: () => import('@app/accelengine-modules/module-logs/logs.module').then(m => m.LogsModule), canActivate: [AuthorizationMenuGuard] },
                ]
            },
            { path: 'login', component: AppLoginComponent },
            { path: 'notfound', component: AppNotfoundComponent },
            { path: 'maintenance', component: AppUnderMaintenanceComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
