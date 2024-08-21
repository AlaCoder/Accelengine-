/*
 * Verona "version": "1.0.1"
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// Components
import { AppMainComponent } from './app.main.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AppTopbarMenuComponent } from './app.topbarmenu.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';

// Pages
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppUnderMaintenanceComponent } from './pages/app.maintenance.component';
import { AppLoginComponent } from './pages/app.login.component';

// Service
import { MenuService } from './app.menu.service';
import { TopbarMenuService } from './app.topbarmenu.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AppMainComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopbarMenuComponent,
    AppTopBarComponent,
    AppFooterComponent,
    // Pages
    AppNotfoundComponent,
    AppUnderMaintenanceComponent,
    AppLoginComponent
  ],
  entryComponents: [
  ],
  providers: [
    MenuService,
    TopbarMenuService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig,
    ConfirmationService,
    MessageService
  ]
})

export class VeronaModule {
  constructor() { }
}
