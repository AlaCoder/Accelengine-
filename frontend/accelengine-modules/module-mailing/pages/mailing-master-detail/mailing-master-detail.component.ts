import { Component, OnInit, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Component
import { HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { Email, EMAIL_STATUS_LIST } from '../../models/mailing.model';
import { AECriteriaType } from 'accelengine-lib';
import { AECriteriaField } from 'accelengine-lib';

// Services
import { MailingService } from '../../services/mailing.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('MailingMasterDetailComponent');

@Component({
  templateUrl: 'mailing-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class MailingMasterDetailComponent extends HybrideComponent<Email> implements OnInit {

  public appConfig = APP_CONFIG.app;
  email_type_list = EMAIL_STATUS_LIST;
  emailBody: any;

  constructor(
    injector: Injector,
    private mailingService: MailingService,
    private sanitizer: DomSanitizer
  ) {
    super(injector, Email, mailingService, CriteriaComponent);

    this.pageSize = APP_CONFIG.app.pageSize;
    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'fromEmail', header: 'Expéditeur', filter: true },
      { field: 'fromName', header: 'Envoyé par', filter: true },
      { field: 'toEmail', header: 'Destinataire', filter: true },
      { field: 'date', header: 'Date d\'envoi', filter: true, type: ColumnType.DATETIME, format: "DD/MM/YYYY HH:mm", sort: true },
      { field: 'subject', header: 'Objet', filter: true },
      { field: 'emailStatus', header: 'Statut', filter: true, list: EMAIL_STATUS_LIST },
      { field: 'causeOfFailure', header: 'Cause d\'echec', filter: true },
    ]);

    this.pagination = true;
    this.criteria = true;

    this.criterias = AECriteriaField.fromObjects([
      { field: 'fromEmail', header: 'Expéditeur', operation: '==', value: '', type: AECriteriaType.STRING },
      { field: 'fromName', header: 'Envoyé par', operation: '==', value: '', type: AECriteriaType.STRING },
      { field: 'toEmail', header: 'Destinataire', operation: '==', value: '', type: AECriteriaType.STRING },
      { field: 'subject', header: 'Objet', operation: '==', value: '', type: AECriteriaType.STRING },
      { field: 'emailStatus', header: 'Statut', operation: '==', value: '', type: AECriteriaType.LIST, displayField: 'label', returnValue: 'code', values: EMAIL_STATUS_LIST },
      { field: 'date', header: 'Date', value: '', type: AECriteriaType.DATE },
    ]);


    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      fromEmail: [this.selectedData.fromEmail],
      fromName: [this.selectedData.fromName],
      toEmail: [this.selectedData.toEmail],
      cc: [this.selectedData.cc],
      subject: [this.selectedData.subject],
      body: [this.selectedData.body],
      date: [this.selectedData.date],
      causeOfFailure: [this.selectedData.causeOfFailure],
      emailStatus: [this.selectedData.emailStatus],
      attachments: [this.selectedData.attachments],
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
    // Do not remove
    super.initData();
    log.debug('Init Data');
  }

  onDblclickRow(row: Email): void {
    super.onDblclickRow(row);
  }
  afterDblclickRow(): void {
    this.emailBody = this.sanitizer.bypassSecurityTrustHtml(this.selectedData.body + "");
  }
  resendEmail() {
    this.confirmationService.confirm({
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      message: "Veuillez renvoyer cet email ?",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.mailingService.resendEmail(this.selectedData).subscribe(result => {
          log.debug(result);
          if (result) {
            this.selectedData = result;
            this.afterSaveOK();
          }
        });
      }
    });
  }
}
