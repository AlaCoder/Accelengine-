import { Injectable, Injector } from "@angular/core";
import { CrudAPIService, Logger } from 'accelengine-lib';
import { PersonalCriteria } from "../models/personal-criteria.model";
import { APP_CONFIG } from "@app/app.config";
import { Observable, lastValueFrom, map, of } from "rxjs";
import { HttpParams } from "@angular/common/http";

const log = new Logger('PersonalCriteriaService');

@Injectable({ providedIn: 'root' })
export class PersonalCriteriaService extends CrudAPIService<PersonalCriteria>{

    personalCriteria: PersonalCriteria;

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/personalcriteria';
    }

    save(data: PersonalCriteria): Observable<{}> {
        log.debug('create or update personal criteria');
        const url = `${this.endpointService}/save`;
        return this.http.post<PersonalCriteria>(url, data).pipe(map(personalCriteria => {
            this.personalCriteria = personalCriteria as PersonalCriteria;
            return this.personalCriteria;
        }, err => {

        }));;
    }

    async getByCodeMenuAndAccountId(codeMenu: string, accountId: number): Promise<{}> {
        log.debug('get personnal criteria for account {' + accountId + '} + menu {' + codeMenu + '}.');
        if (this.personalCriteria === undefined || this.personalCriteria === null || this.personalCriteria.codeMenu !== codeMenu || this.personalCriteria.account.id !== accountId) {
            const url = `${this.endpointService}/getbymenuandaccount`;
            let params = new HttpParams().set('codemenu', codeMenu).set('accountid', accountId);
            this.personalCriteria = await lastValueFrom(this.http.get<PersonalCriteria>(url, { 'params': params }));
        }
        return this.personalCriteria;
    }

    get() {
        return this.personalCriteria;
    }
}