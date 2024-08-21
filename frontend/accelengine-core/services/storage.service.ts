import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

// Models
import { Account } from '@core/models/account.model';
import { Application } from '../../accelengine-std/models/application.model';

// Services
import { DeviceDetectorService } from 'ngx-device-detector';
import { ThemeHelperService } from '../utilities/theme.helper.service';

// Helper
import { Logger } from 'accelengine-lib';
import { environment } from '@app/environments/environment';


const log = new Logger('StorageService');

@Injectable({ providedIn: 'root' })
export class StorageService {

    storageMap = new Map<string, any>();
    machineId: string;

    public static CURRENT_APP_CODE: string;
    public static CURRENT_APP: string = 'CURRENT_APP';
    public static TOKEN_NAME: string = 'JWT_TOKEN';
    public static CURRENT_ACCOUNT: string = 'CURRENT_ACCOUNT';
    public static PREVIOUS_URL: string = "PREVIOUS_URL";
    public static CURRENT_TENANT: string = "CURRENT_TENANT";
    public static CURRENT_CONFIG_LAYOUTCOLOR: string = "CURRENT_CONFIG_LAYOUTCOLOR";
    public static CURRENT_CONFIG_THEME: string = "CURRENT_CONFIG_THEME";
    public static CURRENT_CONFIG_COLORSCHEME: string = "CURRENT_CONFIG_COLORSCHEME";
    public static CURRENT_MENU_CODE: string = "CURRENT_MENU_CODE";

    constructor(private deviceService: DeviceDetectorService, private themeHelperService: ThemeHelperService) {
        this.getMachineId();
    }

    set(key, value) {
        this.storageMap.set(key, value);
        let map = JSON.stringify(Array.from(this.storageMap.entries()));
        if (environment.production) {
            map = this.encrypt(map);
        }
        if (map) {
            localStorage.setItem(StorageService.CURRENT_APP_CODE, map);
        }
    }

    get(key): any {
        return this.storageMap.get(key);
    }

    delete(key): any {
        let deleted: any = this.storageMap.delete(key);
        let map = JSON.stringify(Array.from(this.storageMap.entries()));
        if (environment.production) {
            map = this.encrypt(map);
        }
        if (map) {
            localStorage.setItem(StorageService.CURRENT_APP_CODE, map);
        }
        return deleted;
    }


    // Application
    setCurrentApp(application: Application): Promise<any> {
        log.info('Set curent App');
        return new Promise((resolve, reject) => {
            StorageService.CURRENT_APP_CODE = application.code;
            let map = localStorage.getItem(StorageService.CURRENT_APP_CODE);
            if (environment.production) {
                map = this.decrypt(map);
            }
            if (map) {
                try {
                    this.storageMap = new Map(JSON.parse(map));
                } catch (error) {
                    localStorage.removeItem(StorageService.CURRENT_APP_CODE);
                    this.setCurrentApp(application);
                }
            }
            resolve(true);
            this.set(StorageService.CURRENT_APP, application);
        });
    }

    getCurrentApp(): Application {
        return this.get(StorageService.CURRENT_APP);
    }

    removeCurrentApp() {
        log.info('Remove App');
        this.delete(StorageService.CURRENT_APP);
    }

    // Token
    setToken(token: string): void {
        this.set(StorageService.TOKEN_NAME, token);
    }

    getToken(): string {
        return this.get(StorageService.TOKEN_NAME);
    }

    removeToken() {
        log.info('Remove Token');
        this.delete(StorageService.TOKEN_NAME);
    }

    // Account
    setCurrentAccount(account: Account) {
        this.set(StorageService.CURRENT_ACCOUNT, account);
    }

    getCurrentAccount(): Account {
        return this.get(StorageService.CURRENT_ACCOUNT);
    }

    removeAccount() {
        log.info('Remove Account');
        this.delete(StorageService.CURRENT_ACCOUNT);
    }

    // Tenant
    setCurrentTenant(tenant: string) {
        this.set(StorageService.CURRENT_TENANT, tenant);
    }

    getCurrentTenant(): string {
        return this.get(StorageService.CURRENT_TENANT);
    }

    removeCurrentTenant() {
        log.info('Remove Tenant');
        this.delete(StorageService.CURRENT_TENANT);
    }


    clearAllStorage() {
        log.info('Clear all storage');

        // Save old values
        const app = this.getCurrentApp();
        const previousUrl: string = this.get(StorageService.PREVIOUS_URL);

        this.storageMap = new Map<string, any>();
        localStorage.removeItem(StorageService.CURRENT_APP_CODE);

        // Set old values
        this.setCurrentApp(app);
        this.set(StorageService.PREVIOUS_URL, previousUrl);

    }

    setConfig() {
        let colorScheme = this.get(StorageService.CURRENT_CONFIG_COLORSCHEME);
        if (this.get(StorageService.CURRENT_CONFIG_THEME)) {
            this.themeHelperService.changeTheme(this.get(StorageService.CURRENT_CONFIG_THEME));
        }
        if (this.get(StorageService.CURRENT_CONFIG_LAYOUTCOLOR)) {
            this.themeHelperService.changeLayoutColor(this.get(StorageService.CURRENT_CONFIG_LAYOUTCOLOR));
        }

        if (colorScheme) {
            setTimeout(() => {
                this.themeHelperService.changeColorScheme(colorScheme);
            }, 500);
        }

    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    encrypt(message) {
        if (message != null) {
            try {
                return CryptoJS.AES.encrypt(message, this.machineId).toString();
            } catch (err) {
                log.error("Error encrypting data in local storage");
                log.error(err);
            }
        }
        return null;
    }

    decrypt(message) {
        if (message != null) {
            try {
                return CryptoJS.AES.decrypt(message, this.machineId).toString(CryptoJS.enc.Utf8);
            } catch (err) {
                log.error("Error decrypting data from local storage");
                log.error(err);
            }
        }
        return null;
    }

    getMachineId() {
        this.machineId = this.deviceService.os + '_' + this.deviceService.deviceType + '_' + this.deviceService.browser + '_' + this.deviceService.browser_version;
    }

}
