import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Component
import { DetailComponent } from 'accelengine-lib';

// Services
import { AccountService } from '@core/services/account.service';
import { AuthenticationService } from '@app/accelengine-core/services/authentication.service';

// Models
import { Account, CIVILITY } from '@core/models/account.model';

// Helpers
import { Logger } from 'accelengine-lib';
import { MustMatch } from '@app/accelengine-core/helpers/validators/must-match.validator';

const log = new Logger('AccountDetailComponent');

@Component({
  templateUrl: 'account-detail.component.html',
})
export class AccountDetailComponent extends DetailComponent<Account> implements OnInit {

  initForm: boolean = true;

  civilitys = CIVILITY;

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {
    super(injector, Account, accountService);

    this.activatedRoute.queryParams.subscribe(params => {
      this.currentId = Number(params['id']);
      this.initData();
    });

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      username: [this.selectedData.username, [Validators.required]],
      email: [this.selectedData.email, [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: [this.selectedData.password, [Validators.minLength(4)]],
      newPassword: [this.selectedData.newPassword, [Validators.minLength(4)]],
      confirmNewPassword: [[Validators.minLength(4)]],
      profile: this.formBuilder.group({
        id: [this.selectedData.profile.id],
        civility: [this.selectedData.profile.civility],
        firstname: [this.selectedData.profile.firstname],
        lastname: [this.selectedData.profile.lastname]
      }),
      contact: this.formBuilder.group({
        id: [this.selectedData.contact.id],
        mainPhone: [this.selectedData.contact.mainPhone, [Validators.min(10000000), Validators.max(99999999)]]
      })
      /*
      address: this.formBuilder.group({
        id: [this.selectedData.address.id],
        addr: [this.selectedData.address.addr],
        postalCode: [this.selectedData.address.postalCode],
        city: [this.selectedData.address.city],
        country: [this.selectedData.address.country],
      })
      */
    }, {
      validators: MustMatch("newPassword", "confirmNewPassword")
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
  }

  onSaveClick() {
    log.debug('Save Click AccountDetailComponent', this.selectedData);
    const self = this;
    const subscribe = this.validation().subscribe(isValid => {
      if (isValid) {
        log.debug('Update');
        if (this.oldselectedData.username.toLowerCase() !== this.formGroup.get("username").value) {
          this.confirmPopup('Veuillez confirmer le changement de nom d\'utilisateur',
            'pi pi-exclamation-triangle',
            'Le changement de nom d\'utilisateur va engendrer une déconnexion de cette session',
            'Confirmer',
            'Annuler').subscribe(ok => {
              if (ok) {
                const subscribe2 = this.accountService.updateMyAccount(this.selectedData['id'], this.selectedData).subscribe(result => {
                  // Do not remove
                  if (result) {
                    this.selectedData = result;
                    this.afterSaveOK();
                    setTimeout(() => {
                      this.authenticationService.logout();
                    }, 500);
                  }
                });
                self.subscriptions.push(subscribe2);
              }
            });
        } else {
          const subscribe2 = this.accountService.updateMyAccount(this.selectedData['id'], this.selectedData).subscribe(result => {
            // Do not remove
            if (result) {
              this.selectedData = result;
              this.afterSaveOK();
            }
          });
          self.subscriptions.push(subscribe2);
        }
      }
    });
    this.subscriptions.push(subscribe);
  }
}
