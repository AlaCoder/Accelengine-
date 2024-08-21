import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Models
import { Account, Profile } from '../models/account.model';
import { APP_CONFIG } from '@app/app.config';

// Services
import { WsDiscoService } from '../helpers/dsc-client/ws-disco.service';
import { StorageService } from './storage.service';

// Helpers
export const TOKEN_NAME: string = '_jwt_token';

@Injectable({ providedIn: 'root' })
export class AuthenticationSOAPService extends WsDiscoService {

    constructor(
        private injector: Injector,
        private storageService: StorageService) {
        super(injector);
    }

    login(username, password): Observable<Account> {

        var param = {};
        param['ip_domain'] = APP_CONFIG.tenant.default;
        param['ip_user'] = username;
        param['ip_pwd'] = password;

        const self = this;
        return super.invokeDiscoWS('wslogin', param)
            .pipe(
                map((response) => {
                    let account: Account = new Account();
                    account.username = username.toUpperCase();

                    account.code = username;

                    let profile: Profile = new Profile();
                    profile.firstname = username.toUpperCase();
                    account.profile = profile;

                    // store user details
                    self.storageService.setCurrentAccount(account);
                    return account;
                }),
                catchError(error => {
                    return throwError(error);
                })
            );
    }
}