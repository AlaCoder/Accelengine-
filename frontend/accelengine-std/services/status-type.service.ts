import { Injectable, Injector } from '@angular/core';
import { AEStatusType } from '@app/accelengine-std/models/aestatus-type.model';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';

//Models

@Injectable()
export class AEStatusTypeService extends CrudAPIService<AEStatusType> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/status/type';
  }

  findOneByCodeDocumentAndCode(codeDocument: string, code: string): Observable<AEStatusType> {
    return this.http.get<AEStatusType>(`${this.endpointService}/getstatustype/${codeDocument}/${code}`);
  }
}
