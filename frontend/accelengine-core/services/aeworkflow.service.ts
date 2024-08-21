import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { AEWorkflow } from 'accelengine-lib';
import { WorkflowHistory } from '@app/accelengine-modules/module-workflow/models/workflowHistory.model';

// Service
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';


@Injectable()
export class AEWorkflowService extends CrudAPIService<AEWorkflow> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/workflowcore';
  }

  getObject(id: number): Observable<AEWorkflow[]> {
    return this.http.get<AEWorkflow[]>(`${this.endpointService}/getobject/${id}`);
  }

  updateNewStatus(id: number, aeWorkflow: AEWorkflow): Observable<AEWorkflow> {
    return this.http.put<AEWorkflow>(`${this.endpointService}/updateaeworkflow/${id}`, aeWorkflow);
  }

  findHistory(id: number): Observable<WorkflowHistory[]> {
    return this.http.get<WorkflowHistory[]>(`${this.endpointService}/findhistory/${id}`);
  }

  findHistoryDTO(id: number): Observable<WorkflowHistory[]> {
    return this.http.get<WorkflowHistory[]>(`${this.endpointService}/findhistorydto/${id}`);
  }

  convertDurationToString(duration: number): string {
    if (duration !== undefined && duration !== null) {
      let days: number = Math.floor(duration / (1000 * 60 * 60 * 24));
      let hours: number = Math.floor((duration / (1000 * 60 * 60)) % 24);
      let minutes: number = Math.floor(duration / (1000 * 60) % 60);
      let seconds: number = Math.floor(duration / (1000)) % 60;
      return (days < 10 ? "0" + days : days) + ":" + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }
    return null;
  }
}
