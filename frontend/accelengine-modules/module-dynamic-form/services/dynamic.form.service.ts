import { Injectable, Injector } from '@angular/core';
import { AEDynamicForm, DFInputValue } from 'accelengine-lib';
import { APP_CONFIG } from '@app/app.config';
import { AEList, CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';

// Helpers

@Injectable()
export class DynamicFormService extends CrudAPIService<AEDynamicForm>{

  constructor(
    private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/dynamicform';
  }

  findAllByDocument(code: string): Observable<AEDynamicForm[]> {
    return this.http.get<AEDynamicForm[]>(`${this.endpointService}/findbydocument/${code}`);
  }

  getValues(idForm: number, idEntity: number, idDocument: number): Observable<AEDynamicForm> {
    return this.http.get<AEDynamicForm>(`${this.endpointService}/getvalues/${idForm}/${idEntity}/${idDocument}`);
  }

  findByInputAndEntity(idForm: number, idEntity: number, idDocument: number): Observable<DFInputValue> {
    return this.http.get<DFInputValue>(`${this.endpointService}/findbyinputandentity/${idForm}/${idEntity}/${idDocument}`);
  }

  saveDatas(idForm: number, idEntity: number, datas: DFInputValue[]): Observable<Response> {
    return this.http.post<Response>(`${this.endpointService}/create/${idForm}/${idEntity}`, datas);
  }
}
