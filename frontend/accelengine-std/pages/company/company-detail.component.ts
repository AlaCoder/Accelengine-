import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Component
import { DetailComponent } from 'accelengine-lib';

// Services
import { CompanyService } from '../../services/company.service';
import { FileService } from '@app/accelengine-modules/module-ged/services/file.service';

// Models
import { Company } from '../../models/company.model';


// Helpers
import { Logger } from 'accelengine-lib';
import { AEFile } from '@app/accelengine-modules/module-ged/models/aefile.model';

const log = new Logger('CompanyDetailComponent');

@Component({
  templateUrl: 'company-detail.component.html',
})
export class CompanyDetailComponent extends DetailComponent<Company> implements OnInit {

  initForm: boolean = true;
  currency: string = '';
  file: File;
  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    public fileService: FileService,
  ) {
    super(injector, Company, companyService);

    this.activatedRoute.queryParams.subscribe(params => {
      this.currentId = Number(params['id']);
      this.initData();
    });


    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      socialReason: [this.selectedData.socialReason, [Validators.required]],
      siren: [this.selectedData.siren, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      tva: [this.selectedData.tva, [Validators.minLength(8)]],
      legalForm: [this.selectedData.legalForm, [Validators.minLength(2), Validators.maxLength(8)]],
      rcs: [this.selectedData.rcs, [Validators.maxLength(50)]],
      activity: [this.selectedData.activity, [Validators.maxLength(50)]],
      workforce: [this.selectedData.workforce],
      webSiteURL: [this.selectedData.webSiteURL, [Validators.pattern("https?://.+")]],
      currency: [this.selectedData.currency, [Validators.minLength(2), Validators.maxLength(4)]],
      logo: [this.selectedData.logo],
      contact: this.formBuilder.group({
        id: [this.selectedData.contact.id],
        mainPhone: [this.selectedData.contact.mainPhone, [Validators.min(10000000), Validators.max(99999999)]],
        fax1: [this.selectedData.contact.fax1, [Validators.min(10000000), Validators.max(99999999)]],
        email1: [this.selectedData.contact.email1, [Validators.email, Validators.maxLength(50)]],
        postalCode: [this.selectedData.contact.postalCode, [Validators.max(99999)]],
        city: [this.selectedData.contact.city, [Validators.maxLength(50)]],
        country: [this.selectedData.contact.country, [Validators.maxLength(50)]],
        mainAddress: [this.selectedData.contact.mainAddress, [Validators.maxLength(200)]],
      })
    });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSaveClick() {
    const self = this;
    const subscribe = this.validation().subscribe(isValid => {
      if (isValid) {
        if (this.file) {
          this.subscriptions.push(this.fileService.uploadDocument(this.file, "JPG,jpeg,png", 1000000000).subscribe((file: AEFile) => {
            if (file) {
              this.selectedData.logo = file;
              this.subscriptions.push(this.companyService.update(this.selectedData['id'], this.selectedData).subscribe(result => {
                log.debug('update ok ', result);
                if (result) {
                  this.selectedData = result;
                  this.afterSaveOK();
                }
              }))
            }
          })),
            this.subscriptions.push(subscribe);
        } else {
          const subscribe2 = this.companyService.update(this.selectedData.id, this.selectedData).subscribe(result => {
            log.debug('update ok ', result);
            if (result) {
              this.selectedData = result;
              this.afterSaveOK();
            }
          });
          self.subscriptions.push(subscribe2);
        }
      }
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
  }

  // Init
  initUI() {
    // Do not remove
    super.initUI();
    log.debug('Init UI');
  }

  initData() {
    this.subscriptions.push(this.companyService.findCompany().subscribe((data) => {
      if (data) {
        this.selectedData = data;
        this.formGroup.patchValue(this.selectedData);
        this.currency = this.selectedData.currency;
        super.afterInitData();
      }
    }));
  }

  receiveDocument(event) {
    if (event.currentFiles.length > 0) {
      this.file = event.currentFiles[0];
    }
  }

}
