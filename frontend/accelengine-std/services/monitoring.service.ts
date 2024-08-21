import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Models
import { Metrics, ThreadDump } from '../models/monitoring.model';

import { APP_CONFIG } from '@app/app.config';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
    constructor(private http: HttpClient) { }

    getMetrics(): Observable<Metrics> {
        return this.http.get<Metrics>(APP_CONFIG.apiBaseUrl + '/monitoring/metrics');
    }

    threadDump(): Observable<ThreadDump> {
        return this.http.get<ThreadDump>(APP_CONFIG.apiBaseUrl + '/monitoring/threaddump');
    }
}