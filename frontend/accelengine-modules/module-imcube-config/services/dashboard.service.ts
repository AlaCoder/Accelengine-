import { Injectable, Injector } from '@angular/core';

// Models
import { CDashboard } from '../models/dashboard.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable()
export class DashboardService extends CrudAPIService<CDashboard>{
    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/imcube/config/dashboard';
    }
}