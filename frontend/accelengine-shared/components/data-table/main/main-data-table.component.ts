// Libs
import { Component, Input, OnInit, OnChanges, Output, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
// Models

// Component
import { DataTableComponent } from '../data-table.component';

// Service
import { ExportFileService } from '@app/accelengine-core/services/exportfile.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@app/accelengine-core/services/storage.service';
// Helpers
import { Logger } from 'accelengine-lib';

// Pipes
import { DecimalPipe } from '@angular/common';

const log = new Logger('DataTableComponent');

@Component({
  selector: 'app-data-table',
  templateUrl: './main-data-table.component.html',
  styleUrls: ['./main-data-table.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainDataTableComponent extends DataTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() showCurrentPageReport: boolean = false;
  @Input() first: number = 0;
  @Input() export: boolean = false;
  @Output() onRowValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowValueKeyUp: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Array<Subscription> = [];

  constructor(
    public sanitizer: DomSanitizer,
    public exportFileService: ExportFileService,
    public translateService: TranslateService,
    public renderer: Renderer2,
    public _decimalPipe: DecimalPipe,
    public storageService: StorageService) {
    super(sanitizer, exportFileService, translateService, renderer, _decimalPipe, storageService);
  }

  ngOnInit() {
    if (this.export) {
      this.subscriptions.push(this.exportFileService.exportCSV.subscribe((data: boolean) => {
        this.exportCSV(this.pTableId);
      }));
      this.subscriptions.push(this.exportFileService.exportExcel.subscribe((data: boolean) => {
        this.exportExcel();
      }));
      this.subscriptions.push(this.exportFileService.exportPdf.subscribe((data: boolean) => {
        this.exportPdf();
      }));
    }
  }

  onValueChange(event, rowData) {
    this.onRowValueChange.emit(rowData);
  }

  onValueKeyup(event, rowData) {
    this.onRowValueKeyUp.emit(rowData);
  }

  onFocusInputNumber(event): void {
    event.srcElement.setSelectionRange(0, 0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
