import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { remove, cloneDeep, filter } from 'lodash';

// Component
import { HybrideComponent } from 'accelengine-lib';

// Models
import { AGGREGATION_TYPE, CWidgetColumn, CFilter, CWidget, FILTER_TYPE, SORT, WIDGET_TYPE, WIDGET_TYPE_LIST, FORMATTING_TYPE } from '../../../models/widget.model';
import { CMetadata, } from '../../../models/metadata.model';
import { COLUMN_TYPE, CTable } from '../../../models/table.model';

// Services
import { WidgetService } from '../../../services/widget.service';
import { MetadataService } from '../../../services/metadata.service';
import { TableService } from '../../../services/table.service';
import { DatetimeHelperService } from '@app/accelengine-core/utilities/datetime.helper.service';
import { CubeDataLoaderService } from '@app/accelengine-modules/module-imcube-config/services/cube-dataloader.service';
// Components
import { Column } from '@shared/components/data-table/data-table.model';
import { CriteriaComponent } from '@shared/components/criteria/criteria.component';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('WidgetMasterDetailComponent');

@Component({
  templateUrl: 'widget-master-detail.component.html',
  styleUrls: ['./widget-master-detail.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class WidgetMasterDetailComponent extends HybrideComponent<CWidget> implements OnInit {

  columnsTable: CWidgetColumn[] = [];
  columnsColumn: CWidgetColumn[] = [];

  metadatas: CMetadata[] = [];
  selectedMetadata: CMetadata;
  selectedTables: CTable[] = [];
  selectedColumns: Array<CWidgetColumn> = [];
  selectedRows: Array<CWidgetColumn> = [];
  selectedPivs: Array<CWidgetColumn> = [];
  selectedFilters: Array<CWidgetColumn> = [];
  selectedSorts: Array<CWidgetColumn> = [];
  widgetType: WIDGET_TYPE;

  widget: CWidget = new CWidget();
  loadDatas: boolean = false;

  displayConfigCol: boolean = false;
  displayConfigAgr: boolean = false;
  displayConfigFilter: boolean = false;
  displayCC: boolean = false;

  val1: string = '';
  val2: string = '';
  val3: string = '';
  val4: string = '';
  val5: string = '';

  displayVal1: boolean = false;
  displayVal2: boolean = false;
  displayVal3: boolean = false;
  displayVal4: boolean = false;
  displayVal5: boolean = false;

  valName1: string = '';
  valName2: string = '';
  valName3: string = '';
  valName4: string = '';
  valName5: string = '';

  selectedColumn: CWidgetColumn;
  columnID: number = 0;

  filters: any[] = [];
  selectedFilter: any;
  valueFilter: any;
  valueMinFilter: any;
  valueMaxFilter: any;
  filterlist: any[] = [];
  valueListFilter: any[] = [];

  aggregations: any[] = [];
  selectedAggr: any;

  dragedCol: CWidgetColumn;

  colName: string = 'Colonnes';
  rowName: string = 'Colonnes';

  formattings: any[] = [];

  constructor(
    injector: Injector,
    private widgetService: WidgetService,
    private metadataService: MetadataService,
    private tableService: TableService,
    private cubeDataLoaderService: CubeDataLoaderService,
    private datetimeHelperService: DatetimeHelperService
  ) {
    super(injector, CWidget, widgetService, CriteriaComponent);

    // UI Customized DataTable
    this.columns = Column.fromObjects([
      { field: 'code', header: 'Code' },
      { field: 'description', header: 'Description' },
      { field: 'widgetType', header: 'Graphique', list: WIDGET_TYPE_LIST }
    ]);

    this.pagination = false;
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      description: [this.selectedData.description],
      metadata: [this.selectedData.metadata, [Validators.required]],
      columns: [this.selectedData.columns],
      rows: [this.selectedData.rows],
      pivs: [this.selectedData.pivs],
      filters: [this.selectedData.filters],
      sorts: [this.selectedData.sorts],
      widgetType: [this.selectedData.widgetType, [Validators.required]],
      showLastLine: [this.selectedData.showLastLine],
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

    this.metadataService.getAllActivate().subscribe((results) => {
      if (results) {
        this.metadatas = results.datas;
      }
    });
  }

  onAddClick() {
    this.loadDatas = false;
    this.selectedMetadata = undefined;
    this.selectedTables = [];
    this.selectedColumns = [];
    this.selectedRows = [];
    this.selectedPivs = [];
    this.selectedFilters = [];
    this.selectedSorts = [];
    this.widgetType = undefined;
    this.widget = new CWidget();
    this.selectedColumn = undefined;
    this.filters = [];
    this.selectedFilter = undefined;
    this.valueFilter = undefined;
    this.valueMinFilter = undefined;
    this.valueMaxFilter = undefined;
    this.aggregations = [];
    this.selectedAggr = undefined;
    this.formattings = [];

    super.onAddClick();
  }

  onSelectRow(row) {
    super.onSelectRow(row);
  }

  onDblclickRow(row: CWidget) {
    super.onDblclickRow(row);
    this.widgetType = row.widgetType;
  }

  afterDblclickRow() {
    this.widget = this.selectedData;
    this.onChangeMetadata(this.widget.metadata);
    this.loadDatas = true;
    this.selectedColumns = this.widget.sortColumns;
    this.selectedRows = this.widget.sortRows;
    this.selectedPivs = this.widget.pivs;
    this.selectedFilters = this.widget.filters;
    this.selectedSorts = this.widget.sorts;
    this.changeWidgetType(this.widget.widgetType);
  }

  onChangeMetadata(metadata: CMetadata) {
    console.log(metadata);
    // TODO select from join
    this.selectedTables = metadata.tables;
    this.selectedMetadata = metadata;
    this.displayCC = this.selectedMetadata.ccs.length > 0;
  }

  getTableName(table: CTable) {
    if (this.selectedMetadata.factTable && table.code === this.selectedMetadata.factTable.code) {
      return 'Fact : ' + table.name;
    }
    else {
      return table.name;
    }
  }

  onDragStart(table, column, cc) {
    log.debug('onDragStart', table, column);
    this.dragedCol = column;
    this.dragedCol.table = table;
  }

  dropColumn(data) {
    log.debug('dropColumn', data);
    if (data.data) {
      delete this.dragedCol.table;
      if (data.dropEffect === 'move') {
        this.selectedColumns = filter(this.selectedColumns, function (col) { return col.code !== data.data.code; });

        this.selectedColumns = [
          // part of the array before the specified index
          ... this.selectedColumns.slice(0, data.index),
          // inserted item
          this.dragedCol,
          // part of the array after the specified index
          ... this.selectedColumns.slice(data.index)
        ]
        this.updateWidget();
      } else {
        let col: CWidgetColumn = cloneDeep(data.data);
        col.id = --this.columnID;
        this.selectedColumns.push(col);
        this.showEditColumn(col);
      }
    }
  }

  dropRow(data) {
    log.debug('dropRow', data);
    if (data.data) {
      delete this.dragedCol.table;
      if (data.dropEffect === 'move') {
        this.selectedRows = filter(this.selectedRows, function (col) { return col.code !== data.data.code; });

        this.selectedRows = [
          // part of the array before the specified index
          ... this.selectedRows.slice(0, data.index),
          // inserted item
          this.dragedCol,
          // part of the array after the specified index
          ... this.selectedRows.slice(data.index)
        ]
        this.updateWidget();
      } else {
        let col: CWidgetColumn = cloneDeep(data.data);
        col.id = --this.columnID;
        this.selectedRows.push(col);
        this.showEditRow(col);
      }
    }

  }

  dropPiv(data) {
    log.debug('dropPiv', data);
    this.selectedPivs = [];
    delete this.dragedCol.table;

    let col: CWidgetColumn = cloneDeep(data.data);
    col.id = --this.columnID;

    this.selectedPivs.push(col);
    this.updateWidget();
  }

  dropFilter(data) {
    log.debug('dropFilter', data);
    if (data.data) {
      let col: CWidgetColumn = cloneDeep(data.data);
      col.id = --this.columnID;
      col.table = this.dragedCol.table;
      delete this.dragedCol.table;
      this.selectedFilters.push(col);
      this.showEditFilter(col);
    }
  }

  dropSort(data) {
    log.debug('dropSort', data);
    if (data.data) {
      let col: CWidgetColumn = cloneDeep(data.data);
      col.id = --this.columnID;
      col.sort = SORT.ASC;
      col.table = this.dragedCol.table;
      delete this.dragedCol.table;
      this.selectedSorts.push(col);
      this.updateWidget();
    }
  }

  onOrderSelectedcolumns(index: number, col: CWidgetColumn, aaa: CWidgetColumn[]) {
    log.debug('onOrderselectedColumns', index, col, aaa);

  }

  removeFromColumns(column) {
    log.debug('removeFromColumns', column);
    if (column) {
      remove(this.selectedColumns, function (col) {
        return col.id == column.id;
      });
      this.updateWidget();
    }
  }

  removeFromRows(column) {
    log.debug('removeFromRows', column);
    if (column) {
      remove(this.selectedRows, function (col) {
        return col.id == column.id;
      });
      this.updateWidget();
    }
  }

  removeFromPivs(column) {
    log.debug('removeFromRows', column);
    if (column) {
      remove(this.selectedPivs, function (col) {
        return col.id == column.id;
      });
      this.updateWidget();
    }
  }

  removeFromFilters(column) {
    log.debug('removeFromFilters', column);
    if (column) {
      remove(this.selectedFilters, function (col) {
        return col.id == column.id;
      });
      this.updateWidget();
    }
  }

  removeFromSorts(column) {
    log.debug('removeFromSorts', column);
    if (column) {
      remove(this.selectedSorts, function (col) {
        return col.id == column.id;
      });
      this.updateWidget();
    }
  }


  changeSort(column: CWidgetColumn) {
    log.debug('changeSort', column);
    if (column) {
      if (column.sort == SORT.DESC)
        column.sort = SORT.ASC;
      else
        column.sort = SORT.DESC;

      this.updateWidget();
    }
  }

  applyDrag(arr, dragResult) {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  }

  changeWidgetType(widgetType: WIDGET_TYPE) {
    this.widgetType = widgetType;
    switch (widgetType) {
      case 'TABLE':
        this.colName = 'Colonnes';
        break;
      case 'PIVOTTABLE':
        this.colName = 'Colonnes';
        this.rowName = 'Groupe ligne';
        break;
      case 'PIVOTTABLE2':
        this.colName = 'Groupe en-tête';
        this.rowName = 'Groupe ligne';
        break;
      case 'INDICATOR':
        this.rowName = 'Indicateur';
        break;
      case 'GAUGE':
        this.rowName = 'Jauges';
        break;
      case 'BAR':
        this.colName = 'Colonnes';
        this.rowName = 'Groupe ligne';
        break;
      case 'PIE':
        this.colName = 'Colonnes';
        this.rowName = 'Groupe ligne';
        break;
    }
    this.updateWidget();
  }

  updateWidget() {
    if (this.selectedMetadata) {
      for (let i = 0; i < this.selectedColumns.length; i++) {
        this.selectedColumns[i].displayOrder = i;
      }

      for (let i = 0; i < this.selectedRows.length; i++) {
        this.selectedRows[i].displayOrder = i;
      }

      let widget: CWidget = new CWidget();
      widget.metadata = this.selectedMetadata;
      widget.columns = this.selectedColumns;
      widget.rows = this.selectedRows;
      widget.pivs = this.selectedPivs;
      widget.filters = this.selectedFilters;
      widget.sorts = this.selectedSorts;
      widget.widgetType = this.widgetType;
      widget.samples = true;
      widget.showLastLine = this.formGroup.get('showLastLine').value;
      this.widget = widget;
      this.execute();
    }
  }

  execute() {
    switch (this.widget.widgetType) {
      case 'TABLE':
        if (this.widget.columns.length > 0) {
          this.loadDatas = true;
          setTimeout(() => {
            this.loadDatas = false;
          });
        }
        break;
      case 'PIVOTTABLE':
        if (this.widget.columns.length > 0 && this.widget.rows.length > 0) {
          this.loadDatas = true;
          setTimeout(() => {
            this.loadDatas = false;
          });
        }
        break;
      case 'PIVOTTABLE2':
        if (this.widget.columns.length > 0 && this.widget.rows.length > 0 && this.widget.pivs.length == 1) {
          this.loadDatas = true;
          setTimeout(() => {
            this.loadDatas = false;
          });
        }
        break;
      case 'INDICATOR':
      case 'GAUGE':
        if (this.widget.rows.length > 0) {
          this.loadDatas = true;
          setTimeout(() => {
            this.loadDatas = false;
          });
        }
        break;
      case 'BAR':
      case 'PIE':
        if (this.widget.columns.length > 0 && this.widget.rows.length > 0) {
          this.loadDatas = true;
          setTimeout(() => {
            this.loadDatas = false;
          });
        }
        break;
    }
  }

  onSaveClick(): void {
    if (this.widget) {
      this.formGroup.get("metadata").setValue(this.selectedMetadata);
      this.formGroup.get("columns").setValue(this.widget.columns);
      this.formGroup.get("rows").setValue(this.widget.rows);
      this.formGroup.get("pivs").setValue(this.widget.pivs);
      this.formGroup.get("filters").setValue(this.widget.filters);
      this.formGroup.get("sorts").setValue(this.widget.sorts);
      this.formGroup.get("widgetType").setValue(this.widget.widgetType);
    }
    super.onSaveClick();
  }

  showEditColumn(column: CWidgetColumn) {
    this.selectedColumn = column;
    this.displayConfigCol = true;

    if (this.widgetType == 'PIVOTTABLE' || this.widgetType == 'BAR' || this.widgetType == 'PIE') {
      this.displayConfigAgr = true;
    } else {
      this.displayConfigAgr = false;
    }
    this.buildFormat(column);
  }

  showEditRow(column: CWidgetColumn) {
    this.selectedColumn = column;
    this.displayConfigCol = true;
    if (this.widget.widgetType !== "PIVOTTABLE" && this.widget.widgetType !== "PIVOTTABLE2" && this.widget.widgetType !== "BAR" && this.widget.widgetType !== "PIE") {
      this.displayConfigAgr = true;
    } else {
      this.displayConfigAgr = false;
    }
    this.buildFormat(column);
  }

  showEditPiv(column: CWidgetColumn) {
    this.selectedColumn = column;
    this.displayConfigCol = true;
    this.displayConfigAgr = true;
    this.buildFormat(column);
  }

  buildFormat(column: CWidgetColumn) {
    this.aggregations = [];
    switch (column.type) {
      case COLUMN_TYPE.STRING:
        this.aggregations.push({ code: AGGREGATION_TYPE.COUNT, label: 'Tout compter' });
        this.aggregations.push({ code: AGGREGATION_TYPE.DISTINCTCOUNT, label: 'Compter les distinct' });
        break;
      case COLUMN_TYPE.LONG:
      case COLUMN_TYPE.INTEGER:
      case COLUMN_TYPE.FLOAT:
        this.aggregations.push({ code: AGGREGATION_TYPE.SUM, label: 'Somme' });
        this.aggregations.push({ code: AGGREGATION_TYPE.MIN, label: 'Min' });
        this.aggregations.push({ code: AGGREGATION_TYPE.MAX, label: 'Max' });
        this.aggregations.push({ code: AGGREGATION_TYPE.AVG, label: 'Moyenne' });
        this.aggregations.push({ code: AGGREGATION_TYPE.COUNT, label: 'Tout compter' });
        this.aggregations.push({ code: AGGREGATION_TYPE.DISTINCTCOUNT, label: 'Compter les distinct' });
        break;
      default:
        break;
    }

    this.formattings = [];
    switch (column.type) {
      case COLUMN_TYPE.DATE:
      case COLUMN_TYPE.DATETIME:
        this.formattings.push({ code: 'F1', label: FORMATTING_TYPE.F1 });
        this.formattings.push({ code: 'F11', label: FORMATTING_TYPE.F11 });
        this.formattings.push({ code: 'F12', label: FORMATTING_TYPE.F12 });
        this.formattings.push({ code: 'F2', label: FORMATTING_TYPE.F2 });
        this.formattings.push({ code: 'F21', label: FORMATTING_TYPE.F21 });
        this.formattings.push({ code: 'F22', label: FORMATTING_TYPE.F22 });
        this.formattings.push({ code: 'F3', label: FORMATTING_TYPE.F3 });
        this.formattings.push({ code: 'F4', label: FORMATTING_TYPE.F4 });

        break;
      default:
        break;
    }


    this.displayVal1 = false;
    this.displayVal2 = false;
    this.displayVal3 = false;
    this.displayVal4 = false;

    if (this.widgetType == 'GAUGE') {
      this.displayVal1 = true;
      this.displayVal2 = true;
      this.displayVal3 = true;
      this.displayVal4 = true;

      this.valName1 = 'Min';
      this.valName2 = 'MAX';
      this.valName3 = '1 Niveau';
      this.valName4 = '2 Niveau';
    }
  }

  showEditFilter(column: CWidgetColumn) {
    this.selectedColumn = column;
    this.displayConfigFilter = true;
    this.selectedFilter = undefined;
    this.valueFilter = undefined;
    this.valueMinFilter = undefined;
    this.valueMaxFilter = undefined;

    this.filters = [];
    switch (column.type) {
      case COLUMN_TYPE.STRING:
        this.filters.push({ code: FILTER_TYPE.EQUAL, label: 'égal' });
        this.filters.push({ code: FILTER_TYPE.NOTEQUAL, label: 'n\'est pas égal' });
        this.filters.push({ code: FILTER_TYPE.BEGINWITH, label: 'commencer avec' });
        this.filters.push({ code: FILTER_TYPE.ISNULL, label: 'est vide' });
        this.filters.push({ code: FILTER_TYPE.ISNOTNULL, label: 'n\'est pas vide' });
        this.filters.push({ code: FILTER_TYPE.CONTAIN, label: 'dans la liste' });
        break;
      case COLUMN_TYPE.LONG:
      case COLUMN_TYPE.INTEGER:
      case COLUMN_TYPE.FLOAT:
        this.filters.push({ code: FILTER_TYPE.EQUAL, label: 'égal' });
        this.filters.push({ code: FILTER_TYPE.NOTEQUAL, label: 'n\'est pas égal' });
        this.filters.push({ code: FILTER_TYPE.ISNULL, label: 'est vide' });
        this.filters.push({ code: FILTER_TYPE.ISNOTNULL, label: 'n\'est pas vide' });
        this.filters.push({ code: FILTER_TYPE.GT, label: 'supérieur à' });
        this.filters.push({ code: FILTER_TYPE.GE, label: 'supérieur ou égal à' });
        this.filters.push({ code: FILTER_TYPE.LT, label: 'inférieur à' });
        this.filters.push({ code: FILTER_TYPE.LE, label: 'inférieur ou égal à' });
        this.filters.push({ code: FILTER_TYPE.CONTAIN, label: 'dans la liste' });
        this.filters.push({ code: FILTER_TYPE.BETWEEN, label: 'entre' });
        break;
      case COLUMN_TYPE.DATE:
      case COLUMN_TYPE.DATETIME:
        this.filters.push({ code: FILTER_TYPE.EQUAL, label: 'égal' });
        this.filters.push({ code: FILTER_TYPE.ISNULL, label: 'est vide' });
        this.filters.push({ code: FILTER_TYPE.ISNOTNULL, label: 'n\'est pas vide' });
        this.filters.push({ code: FILTER_TYPE.GT, label: 'supérieur à' });
        this.filters.push({ code: FILTER_TYPE.GE, label: 'supérieur ou égal à' });
        this.filters.push({ code: FILTER_TYPE.LT, label: 'inférieur à' });
        this.filters.push({ code: FILTER_TYPE.LE, label: 'inférieur ou égal à' });
        this.filters.push({ code: FILTER_TYPE.CONTAIN, label: 'dans la liste' });
        this.filters.push({ code: FILTER_TYPE.BETWEEN, label: 'entre' });
        break;
      default:
        break;
    }

    if (this.selectedColumn.filter) {
      this.selectedFilter = this.selectedColumn.filter.type;
      if (this.selectedColumn.type === COLUMN_TYPE.DATE || this.selectedColumn.type === COLUMN_TYPE.DATETIME) {
        this.valueFilter = this.selectedColumn.filter.valueDate;
        this.valueMinFilter = this.selectedColumn.filter.minDate;
        this.valueMaxFilter = this.selectedColumn.filter.maxDate;

      } else {
        this.valueFilter = this.selectedColumn.filter.value;
        this.valueMinFilter = this.selectedColumn.filter.min;
        this.valueMaxFilter = this.selectedColumn.filter.max;
        this.valueListFilter = this.selectedColumn.filter.values;
      }
    }
  }

  onFilterChange(filter) {
    if (filter == FILTER_TYPE.CONTAIN) {
      this.cubeDataLoaderService.distinctvalues(this.selectedColumn.table.id, this.selectedColumn.code).subscribe(datas => {
        if (datas) {
          datas.forEach(data => {
            this.filterlist.push({ code: data, label: data });
          });
        }
      });
    }
  }

  closeEditCol() {
    this.displayConfigCol = false
    if (this.val1 != '')
      this.selectedColumn.val1 = this.val1;
    if (this.val2 != '')
      this.selectedColumn.val2 = this.val2;
    if (this.val3 != '')
      this.selectedColumn.val3 = this.val3;
    if (this.val4 != '')
      this.selectedColumn.val4 = this.val4;
    if (this.val5 != '')
      this.selectedColumn.val5 = this.val5;

    this.updateWidget();
  }

  closeEditFilter() {
    if (this.selectedFilter) {
      let filter: CFilter = new CFilter();
      filter.type = this.selectedFilter;
      if (this.selectedColumn.type === COLUMN_TYPE.DATE || this.selectedColumn.type === COLUMN_TYPE.DATETIME) {
        filter.valueDate = this.datetimeHelperService.withoutTime(this.valueFilter);
        filter.value = filter.valueDate.getTime().toString();
        if (this.valueMinFilter) {
          filter.minDate = this.datetimeHelperService.withoutTime(this.valueMinFilter);
          filter.min = filter.minDate.getTime().toString();
        }
        if (this.valueMaxFilter) {
          filter.maxDate = this.datetimeHelperService.withoutTime(this.valueMaxFilter);
          filter.max = filter.maxDate.getTime().toString();
        }
      } else {
        filter.value = this.valueFilter;
        if (this.valueMinFilter)
          filter.min = this.valueMinFilter;
        if (this.valueMaxFilter)
          filter.max = this.valueMaxFilter;
        if (this.valueListFilter)
          filter.values = this.valueListFilter;
      }

      this.selectedColumn.filter = filter;
    }
    this.displayConfigFilter = false;
    this.updateWidget();
  }

  getSortIcon(column: CWidgetColumn) {
    if (column.sort === SORT.ASC)
      return 'fas fa-arrow-up action-bottom';
    else
      return 'fas fa-arrow-down action-bottom';
  }

}