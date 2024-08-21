import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Models
import { Application } from '@std/models/application.model';
import { Company } from '@app/accelengine-std/models/company.model';
import { Tenant } from '@app/accelengine-core/models/tenant.model';
import { AEList } from 'accelengine-lib';
import { Account } from '@app/accelengine-core/models/account.model';

// Services
import { AccountService } from '@core/services/account.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { AuthenticationSOAPService } from '@core/services/authentication.soap.service';
import { StorageService } from '@core/services/storage.service';
import { ApplicationService } from '@core/services/application.service';
import { CompanyService } from '@app/accelengine-std/services/company.service';
import { FileService } from '@app/accelengine-modules/module-ged/services/file.service';
import { TenantService } from '@app/accelengine-std/services/tenant.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  styleUrls: ['./app.login.component.scss'],
})
export class AppLoginComponent implements OnInit, OnDestroy {

  public application: Application;
  public brandText: any;
  public brandDescription: any;
  public isSubmitted = false;
  public isLoading = false;
  public spin: string = 'fa fa-sign-in';
  public spin2: string = 'fa fa-save';

  loginForm: FormGroup;
  returnUrl: string;

  logoPath: string = 'assets/images/logo.png';
  subscriptions: Subscription[] = [];
  tenants: Tenant[] = [];
  activationTenant: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private authenticationService: AuthenticationService,
    private authenticationSOAPService: AuthenticationSOAPService,
    private accountService: AccountService,
    private applicationService: ApplicationService,
    private companyService: CompanyService,
    private fileService: FileService,
    private tenantService: TenantService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      publicKey: ['', [Validators.required]],
      tenant: [null],
    });

    this.application = this.storageService.getCurrentApp();
    if (this.application !== null) {
      this.brandText = this.application.name;
      this.brandDescription = this.application.description + ' - V' + this.application.version;
      this.loginForm.get("publicKey").setValue(this.application.publicKey);
      this.authenticationService.logout(false);
      this.subscriptions.push(this.companyService.findCompany().subscribe((company: Company) => {
        if (company && company.logo) {
          this.logoPath = `${this.fileService.endpointService}/src/${company.logo.id}`;
        }
      }));
      this.activationTenant = this.application.activateMultitenancy;
      if (this.activationTenant === true) {
        this.loginForm.get("tenant").setValidators([Validators.required]);
        this.loginForm.get("tenant").updateValueAndValidity();
        this.subscriptions.push((this.tenantService.getAllActivate().subscribe((res: AEList<Tenant>) => {
          if (res) {
            this.tenants = res.datas;
            if (this.tenants.length) {
              this.loginForm.get("tenant").setValue(this.tenants[0].code);
            }
          }
        })));
      } else {
        this.loginForm.get("tenant").clearValidators();
        this.loginForm.get("tenant").updateValueAndValidity();
      }
    } else {
      this.brandText = 'Problème de connexion';
      this.brandDescription = 'Le serveur d\'application ne répond pas ! contactez l\'administrateur de votre domaine pour obtenir de l\'aide';
    }

    this.authenticationService.loadIP();
    // get return url from route parameters or default to '/'
    let url = (this.route.snapshot.queryParams['returnUrl'] !== '/') ? this.route.snapshot.queryParams['returnUrl'] : APP_CONFIG.app.loggedRedirectPage;
    this.returnUrl = url || '/';
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmitKey() {
    this.isSubmitted = true;
    if (this.f.publicKey.value) {
      this.spin2 = 'fa fa-refresh';
      this.subscriptions.push(this.applicationService.setkey(this.f.publicKey.value).subscribe((application: Application) => {
        this.isSubmitted = false;
        this.spin2 = 'fa fa-save';
        if (application) {
          this.storageService.setCurrentApp(application).then(x => {
            this.application = application;
          });
        }
      }));
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    this.spin = 'fa fa-refresh';

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.spin = 'fa fa-sign-in';
      return;
    }
    this.isLoading = true;
    if (APP_CONFIG.QADBackend) {
      this.subscriptions.push(this.authenticationSOAPService.login(this.f.email.value, this.f.password.value).subscribe(
        data => {
          this.isSubmitted = false;
          this.isLoading = false;
          this.spin = 'fa fa-sign-in';
          if (data) {
            this.router.navigate([decodeURIComponent(this.returnUrl)]);
          }
        },
        error => {
          this.isSubmitted = false;
          this.isLoading = false;
          this.authenticationService.logout(true);
        }));
    } else {
      this.subscriptions.push(this.authenticationService.login(this.f.email.value, this.f.password.value, this.f.tenant.value).subscribe(
        data => {
          this.isSubmitted = false;
          this.spin = 'fa fa-sign-in';
          this.isLoading = false;
          if (data) {
            this.storageService.setCurrentTenant(this.f.tenant.value);
            this.subscriptions.push(this.accountService.getAccountBylogin(this.f.email.value).subscribe((res: Account) => {
              if (res) {
                if (res.redirectMenu) {
                  this.router.navigate([decodeURIComponent(res.redirectMenu.url)]);
                } else {
                  this.router.navigate([decodeURIComponent(this.returnUrl)]);
                }
              }
            }));

          }
        },
        error => {
            this.isSubmitted = false;
            this.isLoading = false;
            this.authenticationService.logout(true);
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscribtion: Subscription) => subscribtion.unsubscribe());
  }
}
