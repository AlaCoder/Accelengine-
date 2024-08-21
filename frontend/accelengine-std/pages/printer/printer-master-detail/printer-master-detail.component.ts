import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Component
import { CodeNameEntity, HybrideComponent } from 'accelengine-lib';

// Services
import { PrinterService } from '@app/accelengine-std/services/printer.service';

// Models
import { Printer } from '@app/accelengine-std/models/printer.model';
import { Column } from '@shared/components/data-table/data-table.model';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';


const log = new Logger('PrinterMasterDetailComponent');

@Component({
  templateUrl: 'printer-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class PrinterMasterDetailComponent extends HybrideComponent<Printer> implements OnInit {

  printers: any[] = [];

  constructor(
    injector: Injector,
    private printerService: PrinterService
  ) {
    super(injector, Printer, printerService, null);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true },
      { field: 'name', header: 'Nom', filter: true },
      { field: 'url', header: 'Url' },
      { field: 'defaultPrinter', header: 'Default' }
    ]);

    this.pagination = false;
    //this.criteria = true;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      code: [this.selectedData.code, [Validators.required]],
      name: [this.selectedData.name, [Validators.required]],
      url: [this.selectedData.url, [Validators.required]],
      defaultPrinter: [this.selectedData.defaultPrinter]
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


    this.printerService.printersname().subscribe(datas => {
      if (datas) {
        datas.forEach(data => {
          this.printers.push({ code: data, label: data });
        });
      }
    });
  }
}
