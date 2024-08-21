import { Component, OnInit, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Validators, FormArray } from '@angular/forms';
import { filter, each } from 'lodash';

// Component
import { DetailComponent } from 'accelengine-lib';

// Models
import { Application, Module, Setting, VALUE_TYPE } from '@std/models/application.model';

// Services
import { ApplicationService } from '@core/services/application.service';

// Helpers
import { environment } from '@env/environment';
import { Logger } from 'accelengine-lib';
const log = new Logger('ApplicationDetailComponent');

@Component({
  templateUrl: 'application-detail.component.html',
})
export class ApplicationDetailComponent extends DetailComponent<Application> implements OnInit {

  initForm: boolean = true;
  formIndex: number = -1;
  isDevMode: boolean = true;

  constructor(
    injector: Injector,
    private applicationService: ApplicationService
  ) {
    super(injector, Application, applicationService);

    this.formGroup = this.formBuilder.group({
      code: [this.selectedData.code, [Validators.required]],
      name: [this.selectedData.name, [Validators.required]],
      description: [this.selectedData.description, [Validators.required]],
      version: [this.selectedData.version, [Validators.required]],
      databaseName: [this.selectedData.databaseName, [Validators.required]],
      databaseVersion: [this.selectedData.databaseVersion, [Validators.required]],
      databaseURL: [this.selectedData.databaseURL, [Validators.required]],
      driverName: [this.selectedData.driverName, [Validators.required]],
      driverVersion: [this.selectedData.driverVersion, [Validators.required]],
      expirationDate: [this.selectedData.expirationDate, [Validators.required]],
      machineId: [this.selectedData.machineId, [Validators.required]],
      publicKey: [this.selectedData.publicKey, [Validators.required]],
      activateMultitenancy: [this.selectedData.activateMultitenancy, [Validators.required]],
      activateMaintenance: [this.selectedData.activateMaintenance, [Validators.required]],
      settings: this.formBuilder.array([])
    });
    this.isDevMode = !environment.production;
  }

  get settingsArray() {
    return (<FormArray>this.formGroup.get('settings')).controls;
  }

  settingsArrayByModule(moduleName: string) {
    let settings = (<FormArray>this.formGroup.get('settings')).controls;
    return filter(settings, function (setting) { return setting.value.module === moduleName; });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
  }

  // Init
  initUI() {
    // Do not add super.initUI();
    // Do not change
    log.debug('Init UI');
    // Do not remove
    this.isEdit = false;
    this.menuSaveService.showSave.next(false);
    this.menuSaveService.isValide.next(false);
    this.isSubmitted = false;
  }

  initData() {
    // Do not remove
    log.debug('Init Data');
    this.subscriptions.push(this.applicationService.getAppInfo().subscribe((res: Application) => {
      this.selectedData = res;
      this.formGroup.patchValue({
        code: this.selectedData.code,
        name: this.selectedData.name,
        description: this.selectedData.description,
        version: this.selectedData.version,
        databaseName: this.selectedData.databaseName,
        databaseVersion: this.selectedData.databaseVersion,
        databaseURL: this.selectedData.databaseURL,
        driverName: this.selectedData.driverName,
        driverVersion: this.selectedData.driverVersion,
        expirationDate: this.selectedData.expirationDate,
        publicKey: this.selectedData.publicKey,
        machineId: this.selectedData.machineId,
        activateMultitenancy: this.selectedData.activateMultitenancy,
        activateMaintenance: this.selectedData.activateMaintenance,
        settings: []
      });
      this.afterInitData();
    }));
  }

  afterInitData() {
    log.info('afterInitData', this.initForm);
    if (this.initForm) {
      const self = this;
      this.initForm = false;
    }
  }

  validation(): Observable<boolean> {
    log.info('validation');
    return Observable.create(observer => {
      this.isSubmitted = true;
      if (this.formGroup.invalid) {
        log.debug('Validation KO');
        if (!environment.production) {
          this.findInvalidControls();
        }
        observer.next(false);
        observer.complete();
      } else {
        log.debug('Validation OK');
        const self = this;
        this.selectedData = this.customMerge(this.selectedData, this.formGroup.value);
        log.info('After customMerge', this.selectedData);
        each(this.selectedData.modules, function (module: Module) {
          module.settings = filter(self.formGroup.value.settings, function (setting) { return setting.module === module.name; });
        });

        observer.next(true);
        observer.complete();
      }
    })
  }

  isTypeString(setting: Setting) {
    return setting.type == VALUE_TYPE.STRING;
  }

  isTypeNumber(setting: Setting) {
    return setting.type == VALUE_TYPE.NUMBER;
  }

  isTypeBoolean(setting: Setting) {
    return setting.type == VALUE_TYPE.BOOLEAN;
  }

}
