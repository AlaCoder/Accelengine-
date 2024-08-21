import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Component
import { AECriteria, AECriteriaField, HybrideComponent } from 'accelengine-lib';

// Models
import { AEFile } from '../../../models/aefile.model';

// Services
import { FileService } from '../../../services/file.service';

// Components
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('FileMasterDetailComponent');

@Component({
  templateUrl: 'file-master-detail.component.html',
  animations: APP_CONFIG.app.animations
})
export class FileMasterDetailComponent extends HybrideComponent<AEFile> implements OnInit {

  constructor(
    injector: Injector,
    private fileService: FileService
  ) {
    super(injector, AEFile, fileService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      {
        field: 'name',
        header: 'Nom',
        filter: true,
      }, {
        field: 'type',
        header: 'Type',
        filter: true,
      }, {
        field: 'size',
        header: 'Size',
        nbrCol: 5,
      }, {
        field: 'shared',
        header: 'Partagé',
        type: ColumnType.BOOLEAN,
      }
    ]);

    this.pagination = true;
    this.criteria = true;
    this.criterias = AECriteriaField.fromObjects([
      {
        header: 'Code',
        field: 'code',
        operation: '==',
        value: ''
      },
      {
        header: 'Nom',
        field: 'name',
        operation: '==',
        value: ''
      }
    ]);


    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      shared: [false],
      img: [null, [Validators.required]],
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


  onSaveClick() {
    log.debug('Save Click', this.formGroup.value);
    const self = this;
    const subscribe = this.validation().subscribe(isValid => {
      if (isValid) {
        self.fileService.uploadFile(this.f.img.value, this.f.shared.value).subscribe(result => {
          //self.selectedData = result;
          if (result) {
            self.messageService.add({ severity: 'success', summary: 'Succès', detail: this.save_ok });
            self.initUI();
            self.initData();
          }
        });
      }
    });
    this.subscriptions.push(subscribe);
  }

}