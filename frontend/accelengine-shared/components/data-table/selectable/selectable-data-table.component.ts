// Libs
import { Component, Output, EventEmitter, OnInit, OnChanges, Input, OnDestroy, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

// Models

// Component
import { DataTableComponent } from '../data-table.component';

// Service
import { ExportFileService } from '@app/accelengine-core/services/exportfile.service';
import { TranslateService } from '@ngx-translate/core';

// Helpers
import { Logger } from 'accelengine-lib';

// Pipes
import { DecimalPipe } from '@angular/common';

const log = new Logger('SelectableDataTableComponent');

@Component({
  selector: 'app-selectable-data-table',
  templateUrl: './selectable-data-table.component.html',
  styleUrls: ['./selectable-data-table.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectableDataTableComponent extends DataTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSelectAllVisible: boolean = true;
  @Input() export: boolean = false;
  @Input() selectionMode: string = '';
  @Output() selectedDataChange = new EventEmitter<any>();

  subscriptions: Array<Subscription> = [];

  constructor(
    public sanitizer: DomSanitizer,
    public exportFileService: ExportFileService,
    public translateService: TranslateService,
    public renderer: Renderer2,
    public _decimalPipe: DecimalPipe) {
    super(sanitizer, exportFileService, translateService,renderer, _decimalPipe);
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

  sendSelectedData(event) {
    if (!this.isDisabled)
      this.selectedDataChange.emit(this.selectedData);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}