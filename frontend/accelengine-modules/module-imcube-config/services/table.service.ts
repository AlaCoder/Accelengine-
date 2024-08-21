import { Injectable, Injector } from '@angular/core';

// Models
import { CTable } from '../models/table.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
import { Observable } from 'rxjs';


@Injectable()
export class TableService extends CrudAPIService<CTable>{
    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/imcube/config/table';
    }

    getTablesByCodes(tablesCodes: string[]): Observable<CTable[]> {
        return this.http.get<CTable[]>(`${this.endpointService}/tablesbycodes/${tablesCodes}`);
    }
}