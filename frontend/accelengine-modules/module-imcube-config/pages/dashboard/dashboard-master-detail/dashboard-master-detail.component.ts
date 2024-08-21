import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { each, cloneDeep } from 'lodash';

// Component
import { HybrideComponent } from 'accelengine-lib';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Models
import { CDashboard, CDashboardCol, CDashboardRow, STRUCTURE_TYPE_LIST } from '../../../models/dashboard.model';
import { CWidget } from '../../../models/widget.model';
import { Role } from '@app/accelengine-core/models/account.model';
import { Column } from '@shared/components/data-table/data-table.model';

// Services
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetService } from '../../../services/widget.service';
import { RoleService } from '@app/accelengine-std/services/role.service';
import { MsgService } from '@core/services/msg.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('DashboardMasterDetailComponent');

@Component({
  templateUrl: 'dashboard-master-detail.component.html',
  styleUrls: ['./dashboard-master-detail.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class DashboardMasterDetailComponent extends HybrideComponent<CDashboard> implements OnInit {

  widgets: CWidget[] = [];
  searchWidgets: string;
  public filtredWidgets: CWidget[] = [];

  dataRoles: Role[] = [];
  columnsRoles: Column[];

  displayAddRow: boolean = false;
  structures: any[] = STRUCTURE_TYPE_LIST;
  selectedStructure: any;
  selectedHeight: number;
  dragedWidget: CWidget;

  constructor(
    injector: Injector,
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private roleService: RoleService,
    private msgService: MsgService
  ) {
    super(injector, CDashboard, dashboardService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Nom' },
      { field: 'description', header: 'Description' }
    ]);

    this.columnsRoles = Column.fromObjects([
      { field: 'code', header: 'Code', filter: true, width: 300 },
      { field: 'name', header: 'Nom' }
    ]);

    this.pagination = false;
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      description: [this.selectedData.description],
      filter: [this.searchWidgets],
      roles: [this.selectedData.roles, [Validators.required]],
      period: [this.selectedData.period],
      dateField: [this.selectedData.dateField],
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
    this.widgetService.getAllActivate().subscribe((results) => {
      if (results) {
        this.widgets = results.datas;
        this.filtredWidgets = results.datas;
      }
    });

    this.roleService.getAllActivate().subscribe(result => {
      log.debug(result);
      if (result) {
        this.dataRoles = result.datas;
      }
    });
  }

  onAddClick() {
    super.onAddClick();
  }

  onSelectRow(event): void {
    super.onSelectRow(event);
  }

  onDblclickRow(event: CDashboard): void {
    super.onDblclickRow(event);
  }
  afterDblclickRow(): void {
    this.calculateHeightOfAllRows();
  }
  onFilterChanged(searchWidgets) {
    if (searchWidgets.length > 0) {
      this.filtredWidgets = [];
      this.filter(searchWidgets.toLowerCase(), this.widgets);
    } else {
      this.filtredWidgets = this.widgets;
    }
  }

  filter(searchWidgets: string, widgets: CWidget[]) {
    const self = this;
    each(widgets, (widget: CWidget) => {
      if (widget.code.toLowerCase().includes(searchWidgets) || widget.description.toLowerCase().includes(searchWidgets)) {
        self.filtredWidgets.push(widget);
      }
    });
  }

  onDragStart(widget) {
    log.debug('onDragStart', widget);
    this.dragedWidget = widget;
  }

  dropWidget($event, col: CDashboardCol) {
    log.debug('dropWidget', $event, col);
    col.widget = cloneDeep(this.dragedWidget);
  }

  addRow() {
    this.displayAddRow = true;
  }

  calculateHeightOfAllRows(): void {
    setTimeout(() => {
      this.selectedData.rows = this.selectedData.rows.map((row: CDashboardRow) => {
        row.calculatedHeight = this.getHeight(row);
        return row;
      });
    });
  }

  getHeight(row: CDashboardRow): number {
    let mainViewElement = document.getElementById('main-view');
    if (mainViewElement) {
      let h = mainViewElement.offsetHeight;
      if (row.height) {
        return (h * row.height) / 100;
      } else {
        return ((h * this.restOfHeight()) / 100) / this.numberOfNotMentionedHeight();
      }
    }
    return 0;
  }

  numberOfNotMentionedHeight(): number {
    let numberOfNotMentionedHeight: number = this.selectedData.rows.filter((row: CDashboardRow) => !row.height).length;
    return numberOfNotMentionedHeight !== 0 ? numberOfNotMentionedHeight : 1;
  }

  restOfHeight(): number {
    return 100 - this.sumOfHeight();
  }

  sumOfHeight(): number {
    let initialValue: number = 0;
    const sumWithInitial = this.selectedData.rows.map((row: CDashboardRow) => row.height).filter((height: number) => height).reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initialValue
    );
    return sumWithInitial;
  }

  closeAddRow() {
    if (!this.selectedStructure) {
      this.msgService.showErrorMessage("Impossible d'ajouter une autre ligne", "Sélectionnez une structure");
      return;
    }
    if (this.sumOfHeight() === 100 || (this.sumOfHeight() + this.selectedHeight > 100)) {
      this.msgService.showErrorMessage("Impossible d'ajouter une autre ligne", "La somme des hauteurs de toutes les structures ne doit pas dépasser 100%");
      return;
    }
    this.displayAddRow = false;
    var row: CDashboardRow = new CDashboardRow();
    row.structure = this.selectedStructure.code;
    row.height = this.selectedHeight;
    const cols = this.selectedStructure.split("-");
    cols.forEach(col => {
      var column: CDashboardCol = new CDashboardCol();
      column.width = col;
      row.columns.push(column);
    });
    this.calculateHeightOfAllRows();
    this.selectedData.rows.push(row);
  }

  onSaveClick(): void {
    this.formGroup.get("roles").setValue(this.selectedData.roles);
    super.onSaveClick();
  }
}