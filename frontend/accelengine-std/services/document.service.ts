import { Injectable, Injector } from '@angular/core';

// Models
import { Document } from '../models/application.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends CrudAPIService<Document>{

  constructor(
    private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/document';
  }

}
