import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';
import { WorkflowHook } from '../models/workflow.model';

@Injectable()
export class WorkflowHookService extends CrudAPIService<WorkflowHook> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/workflowhook';
  }

  findAllByDocument(idDocument: number): Observable<WorkflowHook[]> {
    return this.http.get<WorkflowHook[]>(`${this.endpointService}/findallbydocument/${idDocument}`);
  }
}
