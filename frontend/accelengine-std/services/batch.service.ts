import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { Batch } from '../models/batch.model'

// Services
import { CrudAPIService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('BatchExecutionService');

@Injectable({ providedIn: 'root' })
export class BatchService extends CrudAPIService<Batch> {

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/batch';
    }

    runBatch(id: number): Observable<any> {
        log.debug('Run Batch');
        const url = `${this.endpointService}/run/${id}`;
        return this.http.get(url);
    }

}