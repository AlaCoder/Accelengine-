import { Injectable, Injector } from '@angular/core';

// Models
import { Father } from '../models/father.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
import { Observable } from 'rxjs';

@Injectable()
export class FatherService extends CrudAPIService<Father>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/start/father';
    }

    findAllBySpecialityIndividual(idSpeciality: number): Observable<Father[]> {
        return this.http.get<Father[]>(`${this.endpointService}/byspeciality/${idSpeciality}`);
    }

    findAllBySpecialityIndividualAndType(idSpeciality: number, type: number): Observable<Father[]> {
        return this.http.get<Father[]>(`${this.endpointService}/byspecialityandtype/${idSpeciality}/${type}`);
    }
}