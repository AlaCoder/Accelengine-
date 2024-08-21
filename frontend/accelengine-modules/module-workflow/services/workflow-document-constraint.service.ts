import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';

//Models
import { ConstraintFieldDTO, WorkflowDocumentConstraint } from '../models/workflow.model';

@Injectable()
export class WorkflowDocumentConstraintService extends CrudAPIService<WorkflowDocumentConstraint> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/workflowconstraint';
  }

  getFiledsByDocument(code: string): Observable<ConstraintFieldDTO[]> {
    return this.http.get<ConstraintFieldDTO[]>(`${this.endpointService}/fields/${code}`);
  }
  getFiledConstraintsByDocument(code: string): Observable<WorkflowDocumentConstraint[]> {
    return this.http.get<WorkflowDocumentConstraint[]>(`${this.endpointService}/findconstraintsbydocument/${code}`);
  }

}
