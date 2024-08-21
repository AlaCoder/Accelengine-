import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ImportexportRoutingModule } from './importexport-routing.module';

// Components
import { FileParamMasterDetailComponent } from './pages/fileparam-master-detail/fileparam-master-detail.component';
import { ImportComponent } from './pages/import/import.component';
import { FieldParamFormComponent } from './forms/fieldparam-form/fieldparam-form.component';
import { LineParamFormComponent } from './forms/lineparam-form/lineparam-form.component';

// Services
import { FileParamService } from './services/fileparam.service';
import { ImportExportService } from './services/importexport.service';

@NgModule({
  imports: [
    SharedModule,
    ImportexportRoutingModule
  ],
  declarations: [
    FileParamMasterDetailComponent,
    LineParamFormComponent,
    FieldParamFormComponent,
    ImportComponent
  ],
  entryComponents: [
    LineParamFormComponent,
    FieldParamFormComponent,
  ],
  providers: [
    FileParamService,
    ImportExportService
  ]
})
export class ImportexportModule {
  constructor() {
  }
}
