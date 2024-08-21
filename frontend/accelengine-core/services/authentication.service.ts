import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import publicIp from 'public-ip';

// Models
import { Account } from '../models/account.model';

// Services
import { StorageService } from './storage.service';
import { DeviceDetectorService } from 'ngx-device-detector';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { EventManager, Logger } from 'accelengine-lib';
import { AccountService } from './account.service';

const log = new Logger('AuthenticationService');
export const TOKEN_NAME: string = '_jwt_token';

declare global {
    interface Window {
        RTCPeerConnection: RTCPeerConnection;
        mozRTCPeerConnection: RTCPeerConnection;
        webkitRTCPeerConnection: RTCPeerConnection;
    }
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    endpointService: string;
    ip: string;
    localIp: string;

    constructor(
        private router: Router,
        private http: HttpClient,
        private storageService: StorageService,
        private eventManager: EventManager,
        private deviceService: DeviceDetectorService) {
        this.endpointService = APP_CONFIG.apiBaseUrl + '/authentication';
    }

    login(username: string, password: string, tenant: string) {
        const self = this;
        const ip = self.ip;

        let theme = APP_CONFIG.theme.theme;
        this.storageService.set(StorageService.CURRENT_CONFIG_THEME, theme);

        let layoutColor = APP_CONFIG.theme.layoutColor;
        this.storageService.set(StorageService.CURRENT_CONFIG_LAYOUTCOLOR, layoutColor);

        let colorScheme = APP_CONFIG.theme.colorScheme;
        this.storageService.set(StorageService.CURRENT_CONFIG_COLORSCHEME, colorScheme);

        const info = this.deviceService.os + ' ' + this.deviceService.deviceType + ' ' + this.deviceService.browser + ' ' + this.deviceService.browser_version;
        return this.http.post<Account>(this.endpointService + '/authenticate', { username, password, ip, info, tenant }).pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                self.storageService.setToken(user.token);
            }
            this.eventManager.send({ name: 'core.authenticationservice.login.ok', content: { user: user } })
            return user;
        }));

    }

    logout(doRouter: boolean = true) {
        // remove all local storage
        log.info('Logout', doRouter);
        const self = this;
        let defaultSetting;
        if (doRouter) {
            defaultSetting = this.storageService.setConfig();
        }
        const account: Account = this.storageService.getCurrentAccount();
        if (account) {
            self.http.post<Account>(this.endpointService + '/logout', { account: account, token: this.storageService.getToken() }).subscribe();
        }
        self.storageService.clearAllStorage();
        if (doRouter) {
            self.router.navigate([APP_CONFIG.app.loginPage]);
        }

    }

    async loadIP() {
        log.info('Get IP');
        this.ip = await publicIp.v4();
    }

}