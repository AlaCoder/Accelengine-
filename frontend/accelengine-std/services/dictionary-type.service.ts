import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { DictionaryType } from '../models/dictionaryType.model';
import { DictionaryValue } from '../models/dictionaryValue.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable({
  providedIn: 'root'
})
export class DictionaryTypeService extends CrudAPIService<DictionaryType>{

  constructor(
    private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/dictionary';
  }

  findAllValuesByTypeCode(type: string): Observable<DictionaryValue[]> {
    return this.http.get<DictionaryValue[]>(`${this.endpointService}/valuesbytype/${type}`);
  }

}
