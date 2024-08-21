import { Injectable, Injector } from '@angular/core';

// Models
import { Holiday } from '../models/holiday.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HolidayService extends CrudAPIService<Holiday>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/holiday';
    }

    findAllBetween(beginDate: Date , endDate: Date): Observable<Holiday[]> {
        return this.http.get<Holiday[]>(`${this.endpointService}/findallbetween/${beginDate}/${endDate}`);
    }

    findAllByYear(year: number): Observable<Holiday[]> {
        return this.http.get<Holiday[]>(`${this.endpointService}/findallbyyear/${year}`);
    }

}
