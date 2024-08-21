import { Injectable, Injector } from '@angular/core';

// Models
import { AETranslate } from '../models/translate';

// Services
import { CrudAPIService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';


const log = new Logger('TranslateService');

@Injectable({ providedIn: 'root' })
export class AETranslateService extends CrudAPIService<AETranslate> {
    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/translate';
    }

}