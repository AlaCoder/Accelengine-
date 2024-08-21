import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { Printer } from '../models/printer.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('PrinterService');

@Injectable({ providedIn: 'root' })
export class PrinterService extends CrudAPIService<Printer>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/printer';
    }

    printersname(): Observable<string[]> {
        return this.http.get<string[]>(`${this.endpointService}/printersname`);
    }
}