import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

// Services
import { TranslateService } from '@ngx-translate/core';
import { NavigationUrlService } from '@core/services/navigation-url.service';
import { StorageService } from '@app/accelengine-core/services/storage.service';
import { DynamicFormService } from '@app/accelengine-modules/module-dynamic-form/services/dynamic.form.service';
import { AEWorkflowService } from '@app/accelengine-core/services/aeworkflow.service';
import { FileService } from '@app/accelengine-modules/module-ged/services/file.service';
import { ServiceStoreService } from 'accelengine-lib';;

// Models
import { Application } from '@std/models/application.model';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { PrimeNGConfig } from 'primeng/api';
import { PersonalCriteriaService } from '@app/accelengine-core/services/personal-criteria.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
    ripple: boolean;
    subscriptionUrl: Subscription;
    previousUrl: string = null;
    currentUrl: string = null;

    constructor(
        private primengConfig: PrimeNGConfig,
        private translateService: TranslateService,
        private router: Router,
        private navigationUrlService: NavigationUrlService,
        private titleService: Title,
        private serviceStoreService: ServiceStoreService,
        private dynamicFormService: DynamicFormService,
        private aeWorkflowService: AEWorkflowService,
        private fileService: FileService,
        private storageService: StorageService,
        private personalCriteriaService: PersonalCriteriaService

    ) {
        this.translateService.setDefaultLang(APP_CONFIG.app.language);
        this.translateService.addLangs(APP_CONFIG.app.languages.map(function (a) { return a.code; }));

        this.serviceStoreService.set('DFService', dynamicFormService);
        this.serviceStoreService.set('WFService', aeWorkflowService);
        this.serviceStoreService.set('FileService', fileService);
        this.serviceStoreService.set('LSService', storageService);
        this.serviceStoreService.set('PCService', personalCriteriaService);
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;
        this.subscriptionUrl = this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
                this.navigationUrlService.setCurrentUrl(this.currentUrl);
                this.navigationUrlService.setPreviousUrl(this.previousUrl);
            });
        const application: Application = this.storageService.getCurrentApp();
        if (application != null) {
            this.titleService.setTitle(application.name + ' - ' + application.version);
        } else {
            this.titleService.setTitle('Problème de connexion');
        }
    }

    ngOnDestroy(): void {
        this.subscriptionUrl?.unsubscribe();
    }
}
