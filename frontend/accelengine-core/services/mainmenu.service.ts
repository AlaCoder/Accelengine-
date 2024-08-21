import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Models
import { Menu } from '@core/models/menu.model'
import { AEList } from 'accelengine-lib';

// Services
import { CrudAPIService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
const log = new Logger('MenuService');

@Injectable({ providedIn: 'root' })
export class MainMenuService extends CrudAPIService<Menu> {

    public changeMainMenu: Subject<any> = new Subject();

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/menu';
    }

    getMainMenu(): Observable<AEList<Menu>> {
        log.debug('getMenu');
        const url = `${this.endpointService}/menu`;
        return this.http.get<any>(url);
    }

    getTopMenu(): Observable<AEList<Menu>> {
        log.debug('getTopMenu');
        const url = `${this.endpointService}/topmenu`;
        return this.http.get<any>(url);
    }

    bookmarkMenu(urlMenu: string): Observable<AEList<Menu>> {
        log.debug('bookmarkMenu');
        const url = `${this.endpointService}/bookmarkmenu`;
        return this.http.post<any>(url, { url: urlMenu } as Menu);
    }

    checkAuthorizationMenu(urlMenu: string): Observable<boolean> {
        log.debug('checkAuthorizationMenu');
        const url = `${this.endpointService}/checkauthorization`;
        return this.http.post<boolean>(url, { url: urlMenu } as Menu);
    }
}