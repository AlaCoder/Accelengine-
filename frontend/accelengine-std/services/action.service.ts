import { Injectable, Injector } from '@angular/core';

// Models
import { Action } from '../models/application.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable({
  providedIn: 'root'
})
export class ActionService extends CrudAPIService<Action>{

  constructor(
    private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/action';
  }

}
