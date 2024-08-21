import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { find } from 'lodash';

// Models
import { Account } from '@core/models/account.model';
import { Application } from '@std/models/application.model';
import { Menu } from '@app/accelengine-core/models/menu.model';

// Component
import { AppMainComponent } from './app.main.component';
import { AppComponent } from './app.component';

// Services
import { AuthenticationService } from '@core/services/authentication.service';
import { StorageService } from '@core/services/storage.service';
import { MainMenuService } from '@app/accelengine-core/services/mainmenu.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '@app/accelengine-core/services/account.service';

import { APP_CONFIG } from '@app/app.config';
// data
import *  as  datasJson from '../assets/data.json';
import { TopbarMenuService } from './app.topbarmenu.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  @ViewChild('input1') inputElement1: ElementRef;
  @ViewChild('input2') inputElement2: ElementRef;

  public menu: any[] = [];
  public topMenus: Menu[] = [];
  public application: Application = new Application();
  public account: Account = new Account();
  public accountName: string = "";
  public accountFullName: string = "";
  public accountRole: string = "";
  elem;
  isFullscreen: boolean = false;
  applicationUrlRedirect: string = APP_CONFIG.applicationUrlRedirect;

  constructor(
    public app: AppComponent,
    public appMain: AppMainComponent,
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private router: Router,
    private mainMenuService: MainMenuService,
    public translateService: TranslateService,
    private accountService: AccountService,
    private topbarmenuService: TopbarMenuService,
    @Inject(DOCUMENT) private document: any
  ) { }


  ngOnInit() {
    this.application = this.storageService.getCurrentApp();
    var interval = setInterval(() => {
      this.account = this.storageService.getCurrentAccount();
      if (this.account) {
        this.accountService.initConfig(this.account);
        this.accountName = this.account.profile.firstname.substring(0, 1).toUpperCase() + this.account.profile.lastname.substring(0, 1).toUpperCase();
        this.accountFullName = this.account.profile.fullname;
        if (this.account.roles.length == 1) {
          this.accountRole = this.account.roles[0].name;
        }
        clearInterval(interval);
      }
    }, 100);

    this.elem = document.documentElement;

    if (APP_CONFIG.QADBackend) {
      const datas = datasJson;
      if (datas.topmenus) {
        this.topMenus = datas.menus.datas as Menu[];
      }
      this.menu = this.creatMenus(this.topMenus);
    } else {
      this.mainMenuService.getTopMenu().subscribe(result => {
        if (result) {
          this.initTopMenus(result.datas);
        }
      });
    }

    this.topbarmenuService.bookmark$.subscribe(ok => {
      this.mainMenuService.bookmarkMenu(this.router.url).subscribe(result => {
        if (result) {
          this.initTopMenus(result.datas);
        }
      });
    });
  }

  initTopMenus(menus) {
    this.topMenus = menus.filter(menu => menu.display !== undefined && menu.display === true);
    this.topbarmenuService.clearBookmark();
    this.menu = this.creatMenus(this.topMenus);
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
        return { parentCode: menu.parentCode, code: menu.code, label: menu.label, icon: menu.icon, routerLink: [menu.url], items: items }
      } else {
        return { parentCode: menu.parentCode, code: menu.code, label: menu.label, icon: menu.icon, items: items }
      }
    }
    if (menu.code === 'FAVMENU') {
      this.topbarmenuService.selectBookmark(menu.url);
    }
    return { parentCode: menu.parentCode, code: menu.code, label: menu.label, icon: menu.icon, routerLink: [menu.url] }
  }

  getTopMenus() {
    return this.menu.filter(menu => (menu.code !== 'FAVMAIN' && menu.code !== 'FAVMENU'));
  }

  getBookmarkMenus() {
    return this.menu.filter(menu => menu.code === 'FAVMAIN');
  }

  searchFocus(event) {
    if (this.appMain.search) {
      setTimeout(() => {
        this.inputElement1.nativeElement.focus();
        this.inputElement2.nativeElement.focus();
      }, 100);
    }
  }

  public goProfile(event) {
    event.preventDefault();
    this.router.navigate(['std/access/account/detail'], { queryParams: { id: this.account.id } });
  }

  public goConfig(event) {
    event.preventDefault();
    this.router.navigate(['std/access/account/config'], { queryParams: { id: this.account.id } });
  }

  public doLogout(event) {
    event.preventDefault();
    this.authenticationService.logout(true);
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.isFullscreen = true;
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (document.fullscreenElement !== null) {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
    this.isFullscreen = false;
  }

  toggleFullscreen(): void {
    if (this.isFullscreen) {
      this.closeFullscreen();
    } else {
      this.openFullscreen();
    }
  }

  getLang() {
    const language = find(APP_CONFIG.app.languages, { 'code': this.translateService.currentLang });
    if (language) {
      if (this.accountRole.length > 0) {
        return ' - ' + language.label;
      } else {
        return language.label;
      }
    }
  }
}
