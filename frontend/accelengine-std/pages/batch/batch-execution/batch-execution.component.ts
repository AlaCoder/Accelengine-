import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Component
import { HybrideComponent } from 'accelengine-lib';
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';

// Models
import { BatchExecution, BATCH_STATUS_LIST } from '@std/models/batch.model';

// Services
import { BatchExecutionService } from '@std/services/batch.execution.service';
import { BatchsWebsocketService } from '@std/services/batchs.websocket.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

import { saveAs } from 'file-saver';


const log = new Logger('BatchExecutionComponent');

@Component({
  templateUrl: 'batch-execution.component.html',
  styleUrls: ['./batch-execution.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class BatchExecutionComponent extends HybrideComponent<BatchExecution> implements OnInit, OnDestroy {

  fileLogContent: string;
  fileErrorContent: string;
  outputFileContent: string;
  isLogFileAvailable: boolean;
  isErrorFileAvailable: boolean;
  isOutputFileAvailable: boolean;

  constructor(
    injector: Injector,
    private batchExecutionService: BatchExecutionService,
    private batchsWebsocketService: BatchsWebsocketService
  ) {
    super(injector, BatchExecution, batchExecutionService, null);
    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'std.field_code', filter: true },
      { field: 'name', header: 'std.field_name', filter: true },
      { field: 'description', header: 'std.field_description', filter: true },
      { field: 'startTime', header: 'std.field_start', type: ColumnType.DATETIME, format: 'DD/MM/YYYY HH:mm' },
      { field: 'endTime', header: 'std.field_end', type: ColumnType.DATETIME, format: 'DD/MM/YYYY HH:mm' },
      { field: 'batchStatus', header: 'std.field_status', filter: true, list: BATCH_STATUS_LIST }
    ]);

    this.pagination = true;
    //this.criteria = true;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      name: [this.selectedData.name],
      description: [this.selectedData.description],
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
    log.debug('Init Data');
    // Do not remove
    super.initData();
    const subscribe = this.batchsWebsocketService.getObservable().subscribe({
      next: this.onBatchUpdated,
      error: err => {
        log.error(err);
      }
    });
    this.subscriptions.push(subscribe);

  }

  private onBatchUpdated = data => {
    if (data.type === 'SUCCESS') {
      this.datas = data.message
    }
  }

  afterDblclickRow() {
    this.fileLogContent = null;
    this.fileErrorContent = null;

    this.isLogFileAvailable = (this.selectedData.fileLogPath !== undefined && this.selectedData.fileLogPath !== null && this.selectedData.fileLogPath != "");
    if (this.isLogFileAvailable) {
      const subscribe = this.batchExecutionService.getBatchLog(this.selectedData.id).subscribe(result => {
        if (result) {
          this.fileLogContent = result;
        }
      });
      this.subscriptions.push(subscribe);

    }

    this.isErrorFileAvailable = (this.selectedData.fileErrorPath !== undefined && this.selectedData.fileErrorPath !== null && this.selectedData.fileErrorPath != "");
    if (this.isErrorFileAvailable) {
      const subscribe2 = this.batchExecutionService.getBatchError(this.selectedData.id).subscribe(result => {
        if (result) {
          this.fileErrorContent = result;
        }
      });
      this.subscriptions.push(subscribe2);
    } else {
      this.fileErrorContent = "";
    }

    this.isOutputFileAvailable = (this.selectedData.outputFilePath !== undefined && this.selectedData.outputFilePath !== null && this.selectedData.outputFilePath != "");
    if (this.isOutputFileAvailable) {
      const subscribe3 = this.batchExecutionService.getBatchOutputFile(this.selectedData.id).subscribe(result => {
        if (result) {
          this.outputFileContent = result;
        }
      });
      this.subscriptions.push(subscribe3);
    } else {
      this.outputFileContent = "";
    }
  }

  ngOnDestroy() {
    /**
     *  Unsubscribe from events
     */
    log.debug('On Destroy');
    this.batchsWebsocketService.unsubscribeFromWebSocketEvent(APP_CONFIG.app.prefixBatchSocket);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  downloadOutputFile() {
    let blob: any = new Blob([this.outputFileContent], { type: 'text/json; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    //window.open(url);
    saveAs(blob, this.selectedData.outputFilePath.substring(this.selectedData.outputFilePath.lastIndexOf("\\") + 1));
  }
}

