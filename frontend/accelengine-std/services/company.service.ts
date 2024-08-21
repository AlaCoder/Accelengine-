import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
// Models
import { Company } from '../models/company.model';

// Services
import { AEList, CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable({
    providedIn: 'root'
})
export class CompanyService extends CrudAPIService<Company>{

    constructor(private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/company';
    }

    findCompany(): Observable<Company> {
        const url = `${this.endpointService}/find`;
        return this.http.get<Company>(url);
    }
}
