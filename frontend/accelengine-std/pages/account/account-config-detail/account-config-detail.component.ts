import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';

// Component
import { DetailComponent } from 'accelengine-lib';
import { AppMainComponent } from '@app/accelengine-verona/app.main.component';

// Services
import { StorageService } from '@app/accelengine-core/services/storage.service';
import { AccountService } from '@core/services/account.service';
import { ThemeHelperService } from '@app/accelengine-core/utilities/theme.helper.service';

// Models
import { Account } from '@core/models/account.model';

// Helpers
import { Logger } from 'accelengine-lib';
import { APP_CONFIG } from '@app/app.config';

const log = new Logger('AccountConfigDetailComponent');

@Component({
  templateUrl: 'account-config-detail.component.html',
  styleUrls: ['account-config-detail.component.scss']
})
export class AccountConfigDetailComponent extends DetailComponent<Account> implements OnInit {

  languages = APP_CONFIG.app.languages;
  app_config = APP_CONFIG;


  layoutColors: any[];

  themes: any[];

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private storageService: StorageService,
    public appMain: AppMainComponent,
    private themeHelperService: ThemeHelperService
  ) {
    super(injector, Account, accountService);
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentId = Number(params['id']);
      this.initData();
    });

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      language: [],
      colorScheme: [],
      theme: [],
      layoutColor: [],
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
  }

  // Init
  initUI() {
    // Do not remove
    super.initUI();
    log.debug('Init UI');
  }

  initData() {
    // Do not remove
    super.initData();
    log.debug('Init Data');
    this.layoutColors = [
      { name: 'white', color: '#ffffff' },
      { name: 'blue', color: 'linear-gradient(147.38deg, #4C96B6 0%, #19496C 100%)' },
      { name: 'cyan', color: 'linear-gradient(147.38deg, #4CB6A3 0%, #19536C 100%)' },
      { name: 'deepblue', color: 'linear-gradient(147.38deg, #4C63B6 0%, #19216C 100%)' },
      { name: 'purple', color: 'linear-gradient(147.38deg, #9E768F 0%, #656C98 100%)' },
      { name: 'yellow', color: 'linear-gradient(147.38deg, #C57F6A 0%, #DABE67 100%)' },
      { name: 'deeppurple', color: 'linear-gradient(147.38deg, #684789 0%, #647DEE 100%)' },
      { name: 'orange', color: 'linear-gradient(147.38deg, #BD9279 0%, #BE5757 100%)' },
      { name: 'green', color: 'linear-gradient(147.38deg, #45947A 0%, #A6BF5D 100%)' },
      { name: 'mauve', color: 'linear-gradient(147.38deg, #455B94 0%, #BFAA5D 100%)' },
      { name: 'dusk', color: 'linear-gradient(147.38deg, #7B3F81 0%, #5DB3BF 100%)' },
      { name: 'ocean', color: 'linear-gradient(147.38deg, #455B94 0%, #90B967 100%)' },
      { name: 'deepgreen', color: 'linear-gradient(147.38deg, #767C50 0%, #344B6F 100%)' },
    ];

    this.themes = [
      { name: 'indigo', color1: '#4C63B6', color2: '#6A7EC2' },
      { name: 'blue', color1: '#1992D4', color2: '#3BABE8' },
      { name: 'green', color1: '#27AB83', color2: '#44D4A9' },
      { name: 'deeppurple', color1: '#896FF4', color2: '#B1A0F8' },
      { name: 'orange', color1: '#DE911D', color2: '#E8AB4F' },
      { name: 'cyan', color1: '#00B9C6', color2: '#58CDD5' },
      { name: 'yellow', color1: '#F9C404', color2: '#FDDD68' },
      { name: 'pink', color1: '#C74B95', color2: '#D77FB4' },
      { name: 'purple', color1: '#BA6FF4', color2: '#D1A0F8' },
      { name: 'lime', color1: '#84BD20', color2: '#A3D44E' },
    ];
  }

  afterInitData() {
    log.info('afterInitData');
    const account: Account = this.selectedData;
    this.storageService.setCurrentAccount(account);

    account.settings.forEach((setting) => {
      switch (setting.code) {
        case 'language':
          this.formGroup.get('language').setValue(setting.valueString);
          break;
        case 'colorScheme':
          this.formGroup.get('colorScheme').setValue(setting.valueString);
          break;
        case 'theme':
          this.formGroup.get('theme').setValue(setting.valueString);
          break;
        case 'layoutColor':
          this.formGroup.get('layoutColor').setValue(setting.valueString);
          break;
        default:
          break;
      }
    });
  }

  onSaveClick() {
    log.debug('Save Click AccountConfigDetailComponent', this.selectedData);
    const subscribe = this.accountService.updateMyConfig(this.selectedData['id'], this.formGroup.value).subscribe(result => {
      // Do not remove
      if (result) {
        this.afterInitData();
        this.afterSaveOK();
      }
    });
    this.subscriptions.push(subscribe);
  }

  onChangeLanguage(data) {
    if (data) {
      this.translateService.use(data);
      this.translateService.setDefaultLang(data);
    }
  }

  changeColorScheme(scheme) {
    this.formGroup.get('colorScheme').setValue(scheme);
    this.themeHelperService.changeColorScheme(scheme);
    this.onEditClick();
  }

  changeTheme(theme) {
    this.formGroup.get('theme').setValue(theme);
    this.themeHelperService.changeTheme(theme);
    this.onEditClick();
  }

  changeLayoutColor(layoutColor) {
    this.formGroup.get('layoutColor').setValue(layoutColor);
    this.themeHelperService.changeLayoutColor(layoutColor);
    this.onEditClick();
  }


  onCancelClick() {
    log.info('onCancelClick 111111');
    this.selectedData = cloneDeep(this.oldselectedData);
    this.formGroup.patchValue(this.selectedData);
    this.initUI();

    var colorScheme;
    this.selectedData.settings.forEach((setting) => {
      switch (setting.code) {
        case 'language':
          this.translateService.use(setting.valueString);
          this.translateService.setDefaultLang(setting.valueString);
          this.formGroup.get('language').setValue(setting.valueString);
          break;
        case 'colorScheme':
          colorScheme = setting.valueString;
          this.formGroup.get('colorScheme').setValue(setting.valueString);
          break;
        case 'theme':
          this.themeHelperService.changeTheme(setting.valueString);
          this.formGroup.get('theme').setValue(setting.valueString);
          break;
        case 'layoutColor':
          this.themeHelperService.changeLayoutColor(setting.valueString);
          this.formGroup.get('layoutColor').setValue(setting.valueString);
          break;
        default:
          break;
      }
    });

    setTimeout(() => {
      this.themeHelperService.changeColorScheme(colorScheme);
    }, 500);
  }

}
