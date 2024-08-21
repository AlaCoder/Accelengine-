import { Injectable, Injector } from '@angular/core';

// Models
import { AEActionHistory } from '../models/application.model';

// Services

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { AEList, CrudAPIService, Logger } from 'accelengine-lib';

const log = new Logger('ActionHistoryService');

@Injectable()
export class ActionHistoryService extends CrudAPIService<AEActionHistory>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/action/history';
    }
}