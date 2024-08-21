import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';

// Models
import { AEList, FormComponent } from 'accelengine-lib';
import { Column } from '@app/accelengine-shared/components/data-table/data-table.model';
import { CWidget } from '../../models/widget.model';

// Services
import { WidgetService } from '../../services/widget.service';
import { MenuSaveService } from 'accelengine-lib';
import { MsgService } from '@app/accelengine-core/services/msg.service';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent extends FormComponent<any> implements OnInit, OnDestroy {

  columnsWidgets: Column[];
  dataWidgets: CWidget[];
  selectedData: CWidget[];
  indexOfActivePanel: number;

  constructor(private widgetService: WidgetService,
    private menuSaveService: MenuSaveService,
    private msgService: MsgService,
    private injector: Injector) {

    super(injector, null);

    this.formGroup = this.formBuilder.group({
      file: [null, [Validators.required]],
    });

    this.columnsWidgets = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true },
      { field: 'description', header: 'Description', filter: true },
      { field: 'metadata.description', header: 'Métadata', filter: true }
    ]);

  }

  ngOnInit(): void {
    this.menuSaveService.showSave.next(true);
    this.menuSaveService.isValide.next(true);
    this.subscriptions.push(this.menuSaveService.onClick.subscribe((save: boolean) => {

      if (save) {
        if (this.indexOfActivePanel) {
          // is export mode
          if (this.selectedData && this.selectedData.length) {
            var widgets = cloneDeep(this.selectedData);
            this.setIdsToNull(widgets, []);
            this.subscriptions.push(this.widgetService.exportWidgets(widgets).subscribe((_: string) => {
              this.msgService.showSuccessMessage("Succès", "Les widgets sont bien exportés");
            }));
          } else {
            this.msgService.showErrorMessage("Erreur", "Sélectionnez des widgets pour les exporter");
          }
        } else {
          // is import mode
          this.isSubmitted = true;
          if (this.formGroup.valid) {
            this.subscriptions.push(this.widgetService.importWidgets(this.formGroup.get("file").value).subscribe((_: boolean) => {
              this.msgService.showSuccessMessage("Succès", "Les widgets sont bien importés");
            }));
          }
        }
      }
    }));
    this.subscriptions.push(this.widgetService.getAllActivate().subscribe((res: AEList<CWidget>) => {
      this.dataWidgets = res.datas;
    }));
  }

  setIdsToNull(object: any, excludedProperties: string[] = []): void {
    if (object && object["id"]) {
      object["id"] = null;
    }
    for (let property in object) {
      if (!excludedProperties.includes(property)) {
        if (Array.isArray(object[property])) {
          object[property].forEach((element) => {
            this.setIdsToNull(element, excludedProperties);
          });
        }
        else if (typeof object[property] === 'object') {
          this.setIdsToNull(object[property], excludedProperties);
        }
      }
    }
  }
}
