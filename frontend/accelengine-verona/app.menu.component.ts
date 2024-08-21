import { Component, OnInit } from '@angular/core';
import { each } from 'lodash';

// Models
import { Account } from '@core/models/account.model';
import { Menu } from '@core/models/menu.model';

// Component
import { AppMainComponent } from './app.main.component';

// Services
import { StorageService } from '@core/services/storage.service';
import { MainMenuService } from '@core/services/mainmenu.service';
import { TranslateService } from '@ngx-translate/core';

// Helpers
import { APP_CONFIG } from '@app/app.config';

// data
import *  as  datasJson from '../assets/data.json';


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss'],
})
export class AppMenuComponent implements OnInit {
    public firstMainMenus: Menu[] = [];
    public mainMenus: Menu[] = [];

    // filtred
    public searchMenu: string;
    public filtredMenus: any[] = [];

    constructor(
        public app: AppMainComponent,
        private storageService: StorageService,
        private mainMenuService: MainMenuService,
        private translateService: TranslateService) {
    }

    ngOnInit() {
        if (APP_CONFIG.QADBackend) {
            const datas = datasJson;
            if (datas.menus) {
                this.mainMenus = this.creatMenus(datas.menus.datas as Menu[]);
                this.filtredMenus = this.mainMenus;
                this.firstMainMenus = this.mainMenus;
            }
        } else {
            this.mainMenuService.getMainMenu().subscribe(result => {
                if (result) {
                    this.mainMenus = this.creatMenus(result.datas.filter(menu => menu.display !== undefined && menu.display === true));
                    this.filtredMenus = this.mainMenus;
                    this.firstMainMenus = this.mainMenus;
                }
            });
        }

        this.mainMenuService.changeMainMenu.subscribe(selectedMenu => {
            if (selectedMenu) {
                this.mainMenus = [...this.firstMainMenus, selectedMenu];
                this.filtredMenus = this.mainMenus;
            }
        });
    }

    creatMenus(menus: Menu[]) {
        let model: any = [];
        menus.forEach(menu => {
            let m: any = this.creatMenu(menu);
            model.push(m);
        });
        return model;
    }

    creatMenu(menu: Menu): any {
        let items;
        if (menu.menus) {
            items = this.creatMenus(menu.menus.filter(menu => menu.display !== undefined && menu.display === true));
            if (menu.url) {
                return { code: menu.code, label: menu.label, icon: menu.icon, routerLink: [menu.url], items: items }
            } else {
                return { code: menu.code, label: menu.label, icon: menu.icon, items: items }
            }
        }
        return { label: menu.label, icon: menu.icon, routerLink: [menu.url], code: menu.code, items: items  }
    }

    onFilterChanged() {
        if (this.searchMenu.length > 0) {
            this.filtredMenus = [];
            this.filtredMenus.push({ code: '0', label: 'Résultat de recherche', items: [] })

            this.filter(this.searchMenu.toLowerCase(), this.mainMenus);
        } else {
            this.filtredMenus = this.mainMenus;
        }
    }

    filter(searchMenu: string, menus: Menu[]) {
        const self = this;
        each(menus, (menu) => {
            if (menu.items == null && (menu.parentCode !== '0' && menu.parentCode !== '-1')) {
                if (menu.code.toLowerCase().includes(searchMenu) || this.translateService.instant(menu.label).toLowerCase().includes(searchMenu)) {
                    self.filtredMenus[0].items.push(menu);
                }
            } else {
                self.filter(searchMenu, menu.items);
            }
        });
    }

    onMenuClick() {
        if (this.searchMenu != null) {
            this.searchMenu = null;
            this.filtredMenus = this.mainMenus;
        }
    }

    setMainMenu(menus: Menu[]) {
    }
}
