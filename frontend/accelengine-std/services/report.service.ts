import { Injectable, Injector } from '@angular/core';
import { Setting } from '@std/models/application.model';
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService } from 'accelengine-lib';
import { Observable } from 'rxjs';
import { Report, ReportRequestDto } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends CrudAPIService<Report>{

  constructor(
    private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/reporting';
  }

  createNewPDF(reportRequestDto:ReportRequestDto): Observable<string> {
   
    return this.http.post<string>(`${this.endpointService}/createnewpdf`, reportRequestDto);
  }

}
