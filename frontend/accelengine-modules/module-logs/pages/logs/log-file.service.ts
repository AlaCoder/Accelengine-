import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudAPIService } from 'accelengine-lib';
import { APP_CONFIG } from '@app/app.config';

@Injectable({
  providedIn: 'root'
})
export class LogService extends CrudAPIService<any> {
  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/file-explorer';
  }

  getLogs(logDirPath: string): Observable<any> {
    return this.http.post<any>(`${this.endpointService}/gettreebypath`, { path: logDirPath });
  }
}