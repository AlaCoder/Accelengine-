import { NgModule, ModuleWithProviders } from "@angular/core";
import { DatetimeHelperService } from "./datetime.helper.service";
import { NumberHelperService } from "./number.helper.service";
import { ThemeHelperService } from "./theme.helper.service";

@NgModule()
export class UtilitiesModule {
  static forRoot(): ModuleWithProviders<{}> {
    return {
      ngModule: UtilitiesModule,

      providers: [
        DatetimeHelperService,
        NumberHelperService,
        ThemeHelperService
      ]
    };
  }
}