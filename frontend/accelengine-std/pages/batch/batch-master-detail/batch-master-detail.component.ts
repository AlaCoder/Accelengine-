import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Component
import { AECriteria, AECriteriaField, HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Models
import { Batch } from '@std/models/batch.model';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';

// Services
import { BatchService } from '@std/services/batch.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';


const log = new Logger('BatchMasterDetailComponent');

@Component({
  templateUrl: 'batch-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class BatchMasterDetailComponent extends HybrideComponent<Batch> implements OnInit {

  constructor(
    injector: Injector,
    private batchService: BatchService
  ) {
    super(injector, Batch, batchService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'name', header: 'std.field_name', filter: true, width: 200 },
      { field: 'description', header: 'std.field_description' },
      { field: 'status', header: 'std.field_status', type: ColumnType.BOOLEAN },
      { field: 'executer', header: 'std.field_execute', buttonIcon: 'fas fa-play', type: ColumnType.BUTTON, buttonClass: 'p-button-info p-button-sm' }
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
      {
        field: 'name',
        header: 'std.field_name',
        value: ''
      }
    ]);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      name: [this.selectedData.name, [Validators.required]],
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

  onDblclickChildRow(row: any) {
    log.debug('Init UI');
    return null;
  }

  onButtonClickEvent(event: any) {
    if (event.field === 'executer') {
      log.debug('Batch', event.row);
      this.subscriptions.push(this.batchService.runBatch(event.row.id).subscribe((result) => {
      }));
    }
  }

}