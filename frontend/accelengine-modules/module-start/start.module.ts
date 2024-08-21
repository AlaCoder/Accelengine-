import { NgModule } from '@angular/core';

// Modules
import { SharedModule } from '@app/accelengine-shared/shared.module';
import { StartRoutingModule } from './start-routing.module';

// Components
import { FatherMasterDetailComponent } from './pages/father-master-detail/father-master-detail.component';
import { ChildFormComponent } from './pages/child-form/child-form.component';

// Services
import { FatherService } from './services/father.service';
import { DocumentService } from '@app/accelengine-std/services/document.service';
import { DynamicFormService } from '../module-dynamic-form/services/dynamic.form.service';
import { ReportService } from '@app/accelengine-std/services/report.service';
import { FileService } from '../module-ged/services/file.service';

@NgModule({
  imports: [
    SharedModule,
    StartRoutingModule,
  ],
  declarations: [
    FatherMasterDetailComponent,
    ChildFormComponent
  ],
  providers: [
    FatherService,
    DocumentService,
    DynamicFormService,
    ReportService,
    FileService
  ]
})
export class StartModule {
  constructor() {
  }
}
