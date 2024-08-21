import { NgModule } from '@angular/core';

// Modules
import { SharedModule } from '@shared/shared.module';

// Components
import { WidgetViewComponent } from '../module-imcube-config/pages/widget/widget-view/widget-view.component';
import { WidgetViewTableComponent } from '../module-imcube-config/pages/widget/widget-view-table/widget-view-table.component';
import { WidgetViewPivottableComponent } from '../module-imcube-config/pages/widget/widget-view-pivottable/widget-view-pivottable.component';
import { WidgetViewPivottable2Component } from '../module-imcube-config/pages/widget/widget-view-pivottable2/widget-view-pivottable2.component';
import { WidgetViewIndicatorComponent } from '../module-imcube-config/pages/widget/widget-view-indicator/widget-view-indicator.component';
import { WidgetViewGaugeComponent } from '../module-imcube-config/pages/widget/widget-view-gauge/widget-view-gauge.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';

// Services
import { ImageService } from '../module-masterdata/services/image.service';
import { UserService } from '../module-masterdata/services/user.service';
import { SettingAppService } from '../module-setting/services/setting-app.service';


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    // Cube
    WidgetViewComponent,
    WidgetViewTableComponent,
    WidgetViewPivottableComponent,
    WidgetViewPivottable2Component,
    WidgetViewIndicatorComponent,
    WidgetViewGaugeComponent,

    //managements documents

    //upload Image
    UploadImageComponent

    // Dynamic Form
  ],
  exports: [
    SharedModule,

    // Cube
    WidgetViewComponent,
    WidgetViewTableComponent,
    WidgetViewPivottableComponent,
    WidgetViewPivottable2Component,
    WidgetViewIndicatorComponent,
    WidgetViewGaugeComponent,

    //managements documents

    //upload Image
    UploadImageComponent,

    // Dynamic Form
  ],
  providers: [
    ImageService,
    UserService,
    SettingAppService

  ]
})
export class AppSharedModule { }
