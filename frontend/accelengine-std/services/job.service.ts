import { Injectable, Injector } from '@angular/core';

// Models
import { Job } from '../models/job.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable({ providedIn: 'root' })
export class JobService extends CrudAPIService<Job>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/job';
    }

}