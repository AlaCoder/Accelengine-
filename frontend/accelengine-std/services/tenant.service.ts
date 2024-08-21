import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';
import { Tenant } from '../../accelengine-core/models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService extends CrudAPIService<Tenant>{

  constructor(
    private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/tenant';
  }

  getAllTreesOfTenants(): Observable<Tenant[]> {
    const url = `${this.endpointService}/getalltreesoftenants`;
    return this.http.get<Tenant[]>(url);
  }

  getPossibleParentList(id: number): Observable<Tenant[]> {
    const url = `${this.endpointService}/getpossibleparentlist/${id}`;
    return this.http.get<Tenant[]>(url);
  }

}
