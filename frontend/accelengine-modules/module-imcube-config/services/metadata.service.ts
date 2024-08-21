import { Injectable, Injector } from '@angular/core';

// Models
import { CMetadata } from '../models/metadata.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable()
export class MetadataService extends CrudAPIService<CMetadata>{
    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/imcube/config/metadata';
    }
}