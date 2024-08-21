import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';


// Models
import { Document } from '@app/accelengine-std/models/application.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';

// Services
import { DocumentService } from '@app/accelengine-std/services/document.service';



// Components
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';
import { HybrideComponent } from 'accelengine-lib';


// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('DocumentMasterDetailComponent');

@Component({
  templateUrl: './document-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class DocumentMasterDetailComponent extends HybrideComponent<Document> implements OnInit {

  constructor(
    injector: Injector,
    private documentService: DocumentService,
  ) {

    super(injector, Document, documentService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true },
      { field: 'name', header: 'Nom', filter: true },
      { field: 'history', header: 'Historiser les actions', type: ColumnType.BOOLEAN, filter: true }
    ]);

    this.pagination = true;
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      code: [this.selectedData.code],
      name: [this.selectedData.name],
      history: [this.selectedData.history],
    });
  }

  onSaveClick() {

    super.onSaveClick();
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
}
