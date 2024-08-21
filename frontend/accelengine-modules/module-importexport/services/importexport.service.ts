import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Models
import { Import } from '../models/import.model';

// Services

import { APP_CONFIG } from '@app/app.config';
import { AECriteria } from 'accelengine-lib';




@Injectable({ providedIn: 'root' })
export class ImportExportService {

    endpointService: string;

    constructor(
        private http: HttpClient) {
        this.endpointService = APP_CONFIG.apiBaseUrl + '/importexport';
    }

    import(values: Import): Observable<any> {
        const formData: FormData = new FormData();
        formData.append("code", values.type.code + '');
        formData.append("file", values.file);
        const url = `${this.endpointService}/import`;
        return this.http.post<any>(url, formData);
    }

    exporter(code: string, criteria :AECriteria): Observable<any> {
        const url = `${this.endpointService}/export`;
        const params = new HttpParams().set('code', code);
        console.log("export du " + code + " avec les criteres : " + criteria)
        return this.http.post<any>(url, criteria, {'params' : params});
    }
}