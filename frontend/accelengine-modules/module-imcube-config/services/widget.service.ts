import { Injectable, Injector } from '@angular/core';

// Models
import { CWidget } from '../models/widget.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class WidgetService extends CrudAPIService<CWidget>{
    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/imcube/config/widget';
    }

    executFromWidgetID(widgetID: number): Observable<CWidget> {
        return this.http.get<CWidget>(`${this.endpointService}/executfromwidgetid/${widgetID}`);
    }

    executFromWidgetCode(widgetCode: string): Observable<CWidget> {
        return this.http.get<CWidget>(`${this.endpointService}/executfromwidgetcode/${widgetCode}`);
    }

    executFromWidget(widget: CWidget): Observable<CWidget> {
        return this.http.post<CWidget>(`${this.endpointService}/executfromwidget`, widget);
    }

    exportfromwidgetid(widgetID: number): Observable<any> {
        const url = `${this.endpointService}/exportfromwidgetid/${widgetID}`;
        const req = new HttpRequest('GET', url, {
            responseType: "blob"
        });
        return this.http.request(req);
    }

    exportWidgets(widgets: CWidget[]): Observable<string> {
        return this.http.post<string>(`${this.endpointService}/export`, widgets);
    }

    importWidgets(file: any): Observable<boolean> {
        const formData: FormData = new FormData();
        formData.append("file", file);
        return this.http.post<any>(`${this.endpointService}/import`, formData);
    }
}