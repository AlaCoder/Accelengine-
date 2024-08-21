import { NgModule } from '@angular/core';

// Modules
import { SharedModule } from '@app/accelengine-shared/shared.module';
import { MailingRoutingModule } from './mailing-routing.module';

// Components
import { MailingMasterDetailComponent } from './pages/mailing-master-detail/mailing-master-detail.component';

// Services
import { MailingService } from './services/mailing.service';

@NgModule({
  imports: [
    SharedModule,
    MailingRoutingModule,
  ],
  declarations: [
    MailingMasterDetailComponent,

  ],
  providers: [
    MailingService
  ]
})
export class MailingModule {
  constructor() {
  }
}
