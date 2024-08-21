import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';

//Models
import { Workflow } from '../models/workflow.model';

@Injectable()
export class WorkflowService extends CrudAPIService<Workflow> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/workflow';
  }

  findActiveWorkflowByDocumentCode(code: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.endpointService}/findactiveworkflowbydocumentcode/${code}`);
  }
}
