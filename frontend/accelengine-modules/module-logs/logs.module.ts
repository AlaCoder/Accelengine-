import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponent } from './pages/logs/logs.component';
import { FileExplorerService } from '@app/accelengine-std/services/file-explorer.service';

@NgModule({
  declarations: [
    LogsComponent
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    SharedModule
  ],
  providers : [
    FileExplorerService
  ]
})
export class LogsModule { }
