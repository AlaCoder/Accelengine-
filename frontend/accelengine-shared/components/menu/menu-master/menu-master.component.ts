import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

// Service
import { ExportFileService } from '@app/accelengine-core/services/exportfile.service';
import { StorageService } from '@app/accelengine-core/services/storage.service';
import { CriteriaSubmitService } from '@app/accelengine-core/services/criteria-submit.service';
import { PersonalCriteriaService } from '@app/accelengine-core/services/personal-criteria.service';
import { PersonalCriteria } from '@app/accelengine-core/models/personal-criteria.model';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss']
})
export class MenuMasterComponent implements OnInit {
  @Input() criteria: boolean = false;
  @Input() displayAdd: boolean = true;
  @Input() displayExport: boolean = false;

  @Output() addClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() criteriaClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() reloadClick: EventEmitter<any> = new EventEmitter<any>();

  nbrCriterias: number = 0;
  current_menu_code: string;
  accountId: number;

  constructor(
    private exportFileService: ExportFileService,
    private storageService: StorageService,
    private criteriaSubmitService: CriteriaSubmitService,
    private personalCriteriaService: PersonalCriteriaService
  ) { }

  ngOnInit() {
    this.initNbrCriterias();
    this.criteriaSubmitService.criteriaSubmit.subscribe((response) => {
      this.initNbrCriterias();
    });
  }

  initNbrCriterias() {
    this.current_menu_code = this.storageService.get(StorageService.CURRENT_MENU_CODE);
    this.accountId = this.storageService.getCurrentAccount().id;
    if (this.current_menu_code && this.accountId) {
      this.personalCriteriaService.getByCodeMenuAndAccountId(this.current_menu_code, this.accountId)
                                  .then(personalCriteria => {
                                          let current_personal_criteria = personalCriteria as PersonalCriteria
                                          this.nbrCriterias = current_personal_criteria ? current_personal_criteria.criteria.criteriaFields.length : 0 
                                  });
    }
  }

  onAddClick() {
    this.addClick.emit(true);
  }


  onCriteriaClick() {
    this.criteriaClick.emit(true);
  }

  onReloadClick() {
    this.reloadClick.emit(true);
  }

  exportPdf() {
    this.exportFileService.exportPdf.next(true);
  }

  exportExcel() {
    this.exportFileService.exportExcel.next(true);
  }

  exportCSV(): void {
    this.exportFileService.exportCSV.next(true);
  }

  manyCriterias() {
    return this.nbrCriterias > 0;
  }
}
