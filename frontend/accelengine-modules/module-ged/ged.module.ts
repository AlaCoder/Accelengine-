import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { GEDRoutingModule } from './ged-routing.module';

// Components
import { FileMasterDetailComponent } from './pages/file/customer-master-detail/file-master-detail.component';

// Services
import { FileService } from './services/file.service';

@NgModule({
  imports: [
    SharedModule,
    GEDRoutingModule
  ],
  declarations: [
    FileMasterDetailComponent,
  ],
  entryComponents: [
  ],
  providers: [
    FileService
  ]
})
export class GEDModule {

  constructor() {
  }

}
