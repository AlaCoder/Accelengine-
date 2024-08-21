import { NgModule } from '@angular/core';

import { DynamicFormRoutingModule } from './dynamic-form-routing.module';
import { FormsInputFormComponent } from './pages/forms/forms-input-form/forms-input-form.component';
import { FormsMasterDetailComponent } from './pages/forms/forms-master-detail/forms-master-detail.component';
import { DynamicFormService } from './services/dynamic.form.service';
import { SharedModule } from '@app/accelengine-shared/shared.module';
import { DocumentService } from '@app/accelengine-std/services/document.service';


@NgModule({
  declarations: [FormsMasterDetailComponent, FormsInputFormComponent],
  imports: [
    SharedModule,
    DynamicFormRoutingModule
  ],
  providers: [
    DynamicFormService,
    DocumentService
  ],
})
export class DynamicFormModule { }
