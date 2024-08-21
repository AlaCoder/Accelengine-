import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { AEAccountHistory } from '@core/models/account.model';

// Services

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { AEList, CrudAPIService, Logger } from 'accelengine-lib';

const log = new Logger('AccountHistoryService');

@Injectable()
export class AccountHistoryService extends CrudAPIService<AEAccountHistory>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/account/history';
    }

    getLoggedAccouns(): Observable<AEList<AEAccountHistory>> {
        return this.http.get<AEList<AEAccountHistory>>(`${this.endpointService}/loggedaccouns`);
    }
}