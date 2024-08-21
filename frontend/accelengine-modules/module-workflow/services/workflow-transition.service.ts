import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { AEWorkflow } from 'accelengine-lib';
import { WorkflowTransition } from '../models/workflow.model';

// Service
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
@Injectable()
export class TransitionService extends CrudAPIService<WorkflowTransition> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/workflowtransition';
  }

  findAllBySourceAndRoles(idCurrentStatus: Number, roles: Number[], codeDocument: String): Observable<WorkflowTransition[]> {
    return this.http.get<WorkflowTransition[]>(`${this.endpointService}/findallbysourceandrole/${idCurrentStatus}/${roles}/${codeDocument}`);
  }
  findAllBySourceAndRolesAndValidateConstraints(idCurrentStatus: Number, roles: Number[], codeDocument: String,data:AEWorkflow): Observable<WorkflowTransition[]> {
    return this.http.post<WorkflowTransition[]>(`${this.endpointService}/findallbysourceandrolewithconstraints/${idCurrentStatus}/${roles}/${codeDocument}`,data);
  }
}
