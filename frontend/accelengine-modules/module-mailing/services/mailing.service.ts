import { Injectable, Injector } from '@angular/core';

// Models
import { Email } from '../models/mailing.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
import { Observable } from 'rxjs';

@Injectable()
export class MailingService extends CrudAPIService<Email>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/mailing';
    }

    resendEmail(email: Email): Observable<Email> {
        return this.http.put<any>(`${this.endpointService}/resendemail`, email);
    }
}