import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService, WorkflowStatus } from 'accelengine-lib';

//Models

@Injectable()
export class WorkflowStatusService extends CrudAPIService<WorkflowStatus> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/workflowstatus';
  }

}
