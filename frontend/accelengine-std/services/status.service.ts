import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { AEStatus } from '../models/aestatus.model';

//Models

@Injectable()
export class AEStatusService extends CrudAPIService<AEStatus> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/status';
  }

}
