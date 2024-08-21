import { Injectable, Injector } from '@angular/core';

// Models

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
import { CDatasource } from '../models/datasource.model';
import { Observable } from 'rxjs';

@Injectable()
export class DatasourceService extends CrudAPIService<CDatasource>{
    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/imcube/config/datasource';
    }

    getDatabaseTypes(): Observable<string[]> {
        return this.http.get<string[]>(`${this.endpointService}/getdatabasetypes`);
    }

    testConnection(datasource: CDatasource): Observable<boolean> {
        return this.http.post<boolean>(`${this.endpointService}/testconnection`, datasource);
    }

    getMasterdata(datasource: CDatasource): Observable<Map<string,Map<string,string>>> {
        return this.http.post<Map<string,Map<string,string>>>(`${this.endpointService}/getmetadata`, datasource);
    }
}