import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Component
import { DetailComponent } from 'accelengine-lib';

// Models
import { Import } from '../../models/import.model';

// Services
import { ImportExportService } from '../../services/importexport.service';

// Helpers
import { Logger } from 'accelengine-lib';


const log = new Logger('ImportComponent');

@Component({
  templateUrl: 'import.component.html',
})
export class ImportComponent extends DetailComponent<Import> implements OnInit {

  constructor(
    injector: Injector,
    private importExportService: ImportExportService
  ) {
    super(injector, Import, importExportService);

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      type: [null, [Validators.required]],
      file: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
  }

  // Init
  initUI() {
    super.editMode(true);
    log.debug('Init UI');
  }

  initData() {
    log.debug('Init Data');
  }

  onSaveClick() {
    log.debug('Save Click', this.formGroup.value);
    const self = this;
    const subscribe = this.validation().subscribe(isValid => {
      if (isValid) {
        self.importExportService.import(this.formGroup.value).subscribe(result => {
          log.debug(result);
          if (result) {
            // self.messageService.add({ severity: 'success', summary: 'Import', detail: 'Fichier d\'import a été chargé avec succès' });
            //window.open(APP_CONFIG.apiBaseUrl + '/file/src/' + result.id, "_blank");
          }
        });
      }
    });
    this.subscriptions.push(subscribe);
  }

}
