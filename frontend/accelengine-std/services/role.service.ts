import { Injectable, Injector } from '@angular/core';

// Models
import { Role } from '@core/models/account.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('RoleService');

@Injectable({ providedIn: 'root' })
export class RoleService extends CrudAPIService<Role>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/role';
    }
}