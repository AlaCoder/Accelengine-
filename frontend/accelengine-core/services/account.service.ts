import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { PrimeNGConfig } from 'primeng/api';

// Models
import { Account, AccountChildrenTreeDTO, AccountConfig, Role } from '../models/account.model';
import { Setting } from '@app/accelengine-std/models/application.model';

// Services
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeHelperService } from '../utilities/theme.helper.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { CrudAPIService, EventManager, Logger } from 'accelengine-lib';


const log = new Logger('AccountService');

@Injectable({ providedIn: 'root' })
export class AccountService extends CrudAPIService<Account>{

    constructor(
        private injector: Injector,
        private storageService: StorageService,
        private translateService: TranslateService,
        private primengConfig: PrimeNGConfig,
        private eventManager: EventManager,
        private themeHelperService: ThemeHelperService) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/account';
    }

    getAccountBylogin(username: string): Observable<{}> {
        const url = `${this.endpointService}/bylogin`;
        return this.http.post<Account>(url, { username }).pipe(map(account => {
            // store user details
            this.storageService.setCurrentAccount(account);

            // Init config
            this.initConfig(account);

            this.eventManager.send({ name: 'core.accountservice.getaccountbylogin.ok', content: account });
            return account;
        }));
    }

    updateMyAccount(id: number, data: Account): Observable<Account> {
        log.debug('updateMyAccount');
        const url = `${this.endpointService}/updatemyaccount/${id}`;
        return this.http.put<Account>(url, data);
    }

    updateMyConfig(id: number, data: AccountConfig): Observable<AccountConfig> {
        log.debug('updateMyConfig');
        const url = `${this.endpointService}/updatemyconfig/${id}`;
        return this.http.put<AccountConfig>(url, data);
    }

    updateAccountSettings(id: number, data: Setting): Observable<Setting> {
        log.debug('updatesetting');
        const url = `${this.endpointService}/updatesetting/${id}`;
        return this.http.put<Setting>(url, data);
    }

    getAccountSetting(id: number, menuCode: String): Observable<Setting> {
        log.debug('getsetting');
        const url = `${this.endpointService}/getsetting/${id}/${menuCode}`;
        return this.http.get<Setting>(url);
    }

    initConfig(account) {
        var colorScheme;
        account.settings.forEach((setting) => {
            switch (setting.code) {
                case 'language':
                    this.translateService.use(setting.valueString);
                    this.translateService.setDefaultLang(setting.valueString);
                    this.translateService.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
                    break;
                case 'colorScheme':
                    colorScheme = setting.valueString;
                    break;
                case 'theme':
                    this.themeHelperService.changeTheme(setting.valueString);
                    break;
                case 'layoutColor':
                    this.themeHelperService.changeLayoutColor(setting.valueString);
                    break;
                default:
                    break;
            }
        });

        if (colorScheme) {
            setTimeout(() => {
                this.themeHelperService.changeColorScheme(colorScheme);
            }, 500);
        }
    }

    // getFiltredAccounts
    getFiltredAccounts(id?: number, tree?: boolean): Observable<AccountChildrenTreeDTO> {
        const url = id !== null ? `${this.endpointService}/getfiltredaccounts` : `${this.endpointService}/getfiltredaccounts/${id}?tree=${tree}`;
        return this.http.get<AccountChildrenTreeDTO>(url);
    }

    // MH
    hasRole(codeRole: string): boolean {
        if (this.storageService.getCurrentAccount() && this.storageService.getCurrentAccount().roles.find((role: Role) => role.code === codeRole)) {
            return true;
        }
        return false;
    }

    // MH
    isAdminSys(): boolean {
        return this.hasRole("ADMIN_SYS");
    }

    // MH
    isAdminApp(): boolean {
        return this.hasRole("ADMIN_APP");
    }

    accountIsAdminSys(account: Account): boolean {
        if (account && account.roles.find((role: Role) => role.code === "ADMIN_SYS")) {
            return true;
        }
        return false;
    }

    // MH
    accountIsAdminApp(account: Account): boolean {
        if (account && account.roles.find((role: Role) => role.code === "ADMIN_APP")) {
            return true;
        }
        return false;
    }
}
