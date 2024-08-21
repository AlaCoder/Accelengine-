import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { Module } from '../models/application.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';

@Injectable({ providedIn: 'root' })
export class ModuleService extends CrudAPIService<Module>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/module';
    }

    isActivate(code: String): Observable<Boolean> {
        return this.http.get<Boolean>(`${this.endpointService}/isactivate/${code}`);
    }
}