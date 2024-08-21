import { Injectable, Injector } from '@angular/core';
import { Setting } from '@std/models/application.model';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService extends CrudAPIService<Setting>{

  constructor(
    private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/setting';
  }
  
}
