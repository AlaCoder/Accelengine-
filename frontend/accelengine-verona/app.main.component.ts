import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Component
import { AppComponent } from './app.component';

// Models
import { Account } from '@app/accelengine-core/models/account.model';

// Services
import { MenuService } from './app.menu.service';
import { TopbarMenuService } from './app.topbarmenu.service';
import { MainMenuService } from '@app/accelengine-core/services/mainmenu.service';
import { StorageService } from '@app/accelengine-core/services/storage.service';
import { BlockUiService } from 'accelengine-lib';
import { LoadingService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';


@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
    styleUrls: ['./app.main.component.scss']
})
export class AppMainComponent implements OnInit, OnDestroy {

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    menuHoverActive = false;

    topbarMenuActive = false;

    activeTopbarItem: Element;

    searchClick = false;

    search = false;

    configActive: boolean;

    configClick: boolean;

    topbarMenuClick = false;

    public loading: boolean;

    account: Account;

    app_config = APP_CONFIG;

    public blocked: boolean = false;

    subscriptions: Subscription[] = [];
    constructor(
        private menuService: MenuService,
        private mainMenuService: MainMenuService,
        private topbarmenuService: TopbarMenuService,
        public primengConfig: PrimeNGConfig,
        public app: AppComponent,
        private loadingService: LoadingService,
        private storageService: StorageService,
        private router: Router,
        private blockUiService: BlockUiService) {


    }

    ngOnInit(): void {
        this.subscriptions.push(this.loadingService.isLoading.subscribe(loading => {
            setTimeout(() => {
                this.loading = loading;
            }, 0);
        }));
        this.subscriptions.push(this.blockUiService.blocked.subscribe(blocked => {
            setTimeout(() => {
                this.blocked = blocked;
            }, 0);
        }));
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        if (!this.menuClick) {
            if (this.isSlim()) {
                this.menuService.reset();
            }

            this.menuHoverActive = false;
            this.staticMenuMobileActive = false;
        }

        if (this.topbarMenuClick) {
            if (this.isSlim()) {
                this.menuHoverActive = false;
            }
        }
        if (!this.topbarMenuClick) {
            this.topbarmenuService.reset();
        }

        if (!this.searchClick) {
            this.search = false;
        }

        this.searchClick = false;
        this.configClick = false;
        this.menuClick = false;
        this.topbarItemClick = false;
        this.topbarMenuClick = false;
    }

    onMenuButtonClick(event: Event) {
        this.menuClick = true;

        if (!this.isMobile()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        if (event != null)
            event.preventDefault();
    }

    onMenuClick() {
        this.menuClick = true;
    }

    onTopbarMenuClick(event: Event, item) {
        this.topbarMenuClick = true;
        if (item?.parentCode === '-1') {
            this.mainMenuService.changeMainMenu.next(item);
            event.preventDefault();
        } else {
            if (item?.routerLink)
                this.router.navigate(item.routerLink);
        }
    }

    onTopbarItemClick(event: Event, item: Element) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        if (item.className === 'search-item') {
            this.search = !this.search;
            this.searchClick = !this.searchClick;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isMobile() {
        return window.innerWidth < 992;
    }

    isSlim() {
        return APP_CONFIG.theme.menuMode === 'slim';
    }

    isStatic() {
        return APP_CONFIG.theme.menuMode === 'static';
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }
}
