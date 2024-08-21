import { Injectable, Injector } from '@angular/core';

// Models
import { FileParam } from '../models/fileparam.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable({ providedIn: 'root' })
export class FileParamService extends CrudAPIService<FileParam>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/importexport/fileparam';
    }
}