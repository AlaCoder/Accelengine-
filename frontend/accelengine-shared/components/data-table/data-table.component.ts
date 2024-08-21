// Libs
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { filter } from 'lodash';
import { each, split } from 'lodash';
import * as moment from 'moment';
import autoTable from 'jspdf-autotable';
// Models
import { Column, ColumnType } from './data-table.model';

// Service
import { ExportFileService } from '@app/accelengine-core/services/exportfile.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@app/accelengine-core/services/storage.service';

// Helpers
import { Logger } from 'accelengine-lib';
import { Table } from 'primeng/table';

// Pipes
import { DecimalPipe } from '@angular/common';

import { LazyLoadEvent } from 'primeng/api';

const log = new Logger('DataTableComponent');

@Component({ template: '' })
export class DataTableComponent {

  @ViewChild('pTableId') pTableId: Table;

  @Input() columns: Column[];
  @Input() fixedColumns: Column[];
  @Input() fixedWidth: any = '500px';
  @Input() value: any;
  @Input() paginator: boolean;
  @Input() loading: boolean = false;
  @Input() selectedData: any;
  @Input() isDisabled: boolean = false;
  @Input() stateKey: string = 'DATATABLE';
  @Input() export: boolean = true;
  @Input() rows: number = 50;
  @Input() rowsPerPageOptions: number[] = [50, 100, 500];
  @Input() isEditable: boolean = false;
  @Input() scrollHeight: any = "";

  @Output() onPageChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDblclickRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCheckedRowsChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onButtonClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onButtonClickEvent2: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSortChanged: EventEmitter<any> = new EventEmitter<any>();

  allColumns: Column[] = [];
  datas: any;
  filteredDatas: any;
  filteredColumns: Map<string, string> = new Map();
  totalRecords: number;

  public CSVFilename: string;

  constructor(
    public sanitizer: DomSanitizer,
    public exportFileService: ExportFileService,
    public translateService: TranslateService,
    public renderer: Renderer2,
    public _decimalPipe: DecimalPipe,
    public storageService?: StorageService) {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.fixedColumns) {
      each(this.fixedColumns, function (column: Column) {
        delete column.width;
      });
      this.allColumns = [...this.fixedColumns, ...this.columns];
    } else {
      this.allColumns = this.columns;
    }

    if (changes.value && this.value) {
      if (this.value.datas) {
        this.datas = this.value.datas;
        this.filteredDatas = this.value.datas;
        this.totalRecords = this.value.totalRecords;

      } else {
        this.datas = this.value;
        this.filteredDatas = this.value;
      }
    }
  }

  onPageChange(event: LazyLoadEvent) {
    const currentPage = event.first / event.rows;
    const pageSize = event.rows;
    this.onPageChanged.emit(currentPage + ',' + pageSize);
  }

  onSortChange(event: any) {
    event.multisortmeta = filter(event.multisortmeta, function (s) { return s.field !== ''; }); // to avoid repetitive loops
    let current_menu_sort_values = this.storageService.get('CURRENT_MENU_SORT_VALUES'); // to avoid repetitive loops
    if (!current_menu_sort_values || (current_menu_sort_values && (this.checkIfObjectEquals(JSON.parse(current_menu_sort_values), event.multisortmeta) === false))) {
      this.storageService.set('CURRENT_MENU_SORT_VALUES', JSON.stringify(event.multisortmeta));
      this.onSortChanged.emit(event.multisortmeta)
    }
  }

  checkIfObjectEquals(arr1, arr2) {
    if (arr1.length === arr2.length) {
      return arr1.every((item, i) => {
        let keys = Object.keys(item);
        return keys.length === Object.keys(arr2[i]).length &&
          keys.every(key => arr2[i][key] === item[key]);
      });
    } else {
      return false;
    }
  }

  getData(rowData: any, column: Column, elementRef?: ElementRef) {
    const value = this.processingData(rowData, column);

    return this.formattingData(value, column, rowData, elementRef);
  }

  processingData(data: any, column: Column) {

    if (data == null) {
      return null;
    }

    if (column.field == undefined || column.field == null) {
      return data;
    }

    if (column.field.includes('.')) {
      let codes = split(column.field, '.');
      let res = data;
      each(codes, function (field) {
        if (res === undefined || res === null) {
          res = '';
          return;
        }
        res = res[field];
      });
      return res
    }

    return data[column.field];
  }

  formattingData(value: any, column: Column, rowData?: any, elementRef?: ElementRef) {

    // Set empty table cell height 100%
    if (value === undefined || value === null || value === '') {
      return '&nbsp;'
    }

    if (column.type === ColumnType.BOOLEAN) {
      if (value) {
        return '<i class="fa fa-check fa-lg pr-3"></i>';
      } else
        return '<i class="fa fa-times fa-lg pr-3"></i>';
    }

    if (column.type === ColumnType.FILE) {
      if (column.url) {
        return '<a href="' + column.url + '/' + value + '" target="_blank"><i class="fas fa-download fa-lg"></i></a>';
      } else {
        return '<a href="' + value + '" target="_blank"><i class="fas fa-download fa-lg"></i></a>';
      }
    }

    if (column.type === ColumnType.DATETIME) {
      var newDate = moment(value);

      if (column.format !== undefined) {
        return newDate.format(column.format);
      }
      return newDate.format();
    }

    if (column.type === ColumnType.COLOR) {
      if (value) {
        return this.sanitizer.bypassSecurityTrustHtml('<div style="width: 100%; background-color: ' + value + ';">&nbsp;</div>');
      }
    }
    if (column.type === ColumnType.STATUS) {
      if (value) {
        let codes = split(column.field, '.');
        if (rowData && rowData[codes[0]] && rowData[codes[0]]['color'])
          this.renderer.setStyle(elementRef, 'background-color', rowData[codes[0]]['color']);
        return this.sanitizer.bypassSecurityTrustHtml('<span class="p-tag p-component" style="width: 100%;text-align: center;background: ' + rowData[codes[0]]['color'] + ';"><span class="p-tag-value">' + value + '</span></span>');
      }
    }



    if (column.type === ColumnType.LIST) {
      if (value) {
        return value.map(element => element[column.fieldArray] ? element[column.fieldArray] : element).join(', ');
      }
    }

    if (column.type === ColumnType.NUMBER) {
      if (column.expressionPipeDecimal) {
        return this._decimalPipe.transform(value, column.expressionPipeDecimal, "en");
      }
    }

    if (column.list !== undefined) {
      const columnValue = column.list.find(x => x.code === value);

      if (columnValue && column.fieldArray) {
        return columnValue[column.fieldArray];
      } else {
        return columnValue?.label;
      }
    }

    if (column.isDropdown) {
      let columnValue: any;
      let columnFieldToDisplay: string;
      if (rowData && rowData.dropdownValues) {
        let columnKey: string = "code";
        if (rowData.dropdownKeyField) {
          columnKey = rowData.dropdownKeyField;
        } else if (column && column.dropdownKeyField) {
          columnKey = column.dropdownKeyField;
        }
        columnValue = rowData.dropdownValues.find(x => x[columnKey] === value[columnKey]);
        if (rowData.dropdownDisplayField) {
          columnFieldToDisplay = rowData.dropdownDisplayField;
        } else if (column.dropdownDisplayField) {
          columnFieldToDisplay = column.dropdownDisplayField;
        }
      } else if (column && column.dropdownValues) {
        let columnKey: string = "code";
        if (column.dropdownKeyField) {
          columnKey = column.dropdownKeyField;
        }
        columnValue = column.dropdownValues.find(x => x[columnKey] === value[columnKey]);
        columnFieldToDisplay = column.dropdownDisplayField;
      }
      // if (column.dropdownValues) {
      //   if (rowData.dropdownValues && column.dropdownDisplayField) {
      //     const columnValue = rowData.dropdownValues.find(x => x[column.dropdownKeyField] === value[column.dropdownKeyField]);
      //     return columnValue[column.dropdownDisplayField];
      //   }
      //   const columnValue = column.dropdownValues.find(x => x[column.dropdownDisplayField] === value);
      //   return columnValue;
      // }
      if (!columnFieldToDisplay) {
        columnFieldToDisplay = "label";
      }
      if (columnValue) {
        return columnValue[columnFieldToDisplay];
      }
    }

    return value;
  }


  click(data: any) {
    if (!this.isDisabled)
      this.onSelectRow.emit(data);
  }



  dblclick(data: any) {
    if (!this.isDisabled)
      this.onDblclickRow.emit(data);
  }

  filter(dt, value, column: Column) {
    if (value !== '') {
      this.filteredColumns.set(column.field, value);
    } else {
      this.filteredColumns.delete(column.field);
    }
    this.filteredDatas = this.datas;
    if (this.filteredColumns.size > 0) {
      const self = this;
      this.filteredColumns.forEach((value: string, field: string) => {
        self.filteredDatas = filter(self.filteredDatas, function (data) {
          const filteredColumn = self.allColumns.find(column => column.field === field);
          const newValue = self.formattingData(self.processingData(data, filteredColumn), filteredColumn).toString();
          return newValue !== '&nbsp;' && newValue.toLowerCase().includes(value.toLowerCase());
        });
      });
    }
  }

  exportCSV(table) {
    if (this.stateKey !== 'DATATABLE') {
      this.CSVFilename = this.stateKey + '_export_' + new Date().getTime();
      setTimeout(() => {
        let tempDatas: any[] = [];
        this.filteredDatas.forEach((data) => {
          tempDatas.push({ ...data });
        });
        let tempColumns: Column[] = [...this.allColumns];
        let exportColumns: Column[] = this.allColumns.filter((column: Column) => column.export);
        exportColumns.forEach((col: Column) => {
          if (col.type === ColumnType.DATETIME) {
            table._value.forEach((data: any) => {
              data[col.field] = moment(data[col.field]).format(col.format);
            });
          } else if (col.type === ColumnType.LIST) {
            table._value.forEach((data: any) => {
              data[col.field] = data[col.field].map(element => element[col.fieldArray] ? element[col.fieldArray] : element).join(', ')
            });
          } else if (col.list !== undefined) {
            table._value.forEach((data: any) => {
              const columnValue = col.list.find(x => x.code === data[col.field]);
              if (columnValue) {
                if (col.fieldArray) {
                  data[col.field] = columnValue[col.fieldArray].replace(/<[^>]*>/g, '');
                } else {
                  data[col.field] = columnValue.label.replace(/<[^>]*>/g, '');
                }
              }
            });
          }
        });
        table._columns = exportColumns;
        table._columns.forEach((col) => {
          col["header"] = this.translateService.instant(col.header);
        });
        table.exportCSV();
        this.filteredDatas = tempDatas;
        table._columns = tempColumns;
      }, 500);
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();
        let exportedDatas: any[] = [];
        this.filteredDatas.forEach((data) => {
          exportedDatas.push({ ...data });
        });
        let exportColumns: any[] = this.allColumns.filter((column: Column) => column.export).map(col => {
          if (col.type === ColumnType.DATETIME) {
            exportedDatas.forEach((data: any) => {
              data[col.field] = moment(data[col.field]).format(col.format);
            });
          } else if (col.type === ColumnType.LIST) {
            exportedDatas.forEach((data: any) => {
              data[col.field] = data[col.field].map(element => element[col.fieldArray] ? element[col.fieldArray] : element).join(', ')
            });
          } else if (col.list !== undefined) {
            exportedDatas.forEach((data: any) => {
              const columnValue = col.list.find(x => x.code === data[col.field]);
              if (columnValue) {
                if (col.fieldArray) {
                  data[col.field] = columnValue[col.fieldArray].replace(/<[^>]*>/g, '');
                } else {
                  data[col.field] = columnValue.label.replace(/<[^>]*>/g, '');
                }
              }
            });
          }
          var splitted = col.field.split(".");
          if (splitted.length) {
            exportedDatas.forEach((data: any) => {
              data[col.field] = this.processingData(data, col);
            });
          }
          return { title: this.translateService.instant(col.header), dataKey: col.field }
        });
        autoTable(doc, ({
          body: exportedDatas,
          columns: exportColumns,
        }));
        doc.save(this.stateKey + '_export_' + new Date().getTime() + '.pdf');
      })
    });
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      let exportedDatas: any[] = [];
      this.filteredDatas.forEach((data) => {
        exportedDatas.push({ ...data });
      });
      let exportColumns: Column[] = this.allColumns.filter((column: Column) => column.export);
      exportColumns.forEach(col => {
        if (col.type === ColumnType.DATETIME) {
          exportedDatas.forEach((data: any) => {
            data[col.field] = moment(data[col.field]).format(col.format);
          });
        } else if (col.type === ColumnType.LIST) {
          exportedDatas.forEach((data: any) => {
            data[col.field] = data[col.field].map(element => element[col.fieldArray] ? element[col.fieldArray] : element).join(', ')
          });
        } else if (col.list !== undefined) {
          exportedDatas.forEach((data: any) => {
            const columnValue = col.list.find(x => x.code === data[col.field]);
            if (columnValue) {
              if (col.fieldArray) {
                data[col.field] = columnValue[col.fieldArray].replace(/<[^>]*>/g, '');
              } else {
                data[col.field] = columnValue.label.replace(/<[^>]*>/g, '');
              }
            }
          });
        }
        var splitted = col.field.split(".");
        if (splitted.length) {
          exportedDatas.forEach((data: any) => {
            data[col.field] = this.processingData(data, col);
          });
        }
      });
      exportedDatas.map((data) => {
        for (let property in data) {
          if (!exportColumns.find((column: Column) => column.field === property)) {
            delete data[property];
          }
        }
        return data;
      });
      let headers: string[][] = [];
      headers[0] = [];
      for (var i: number = 0; i < exportColumns.length; i++) {
        headers[0][i] = this.translateService.instant(exportColumns[i].header);
        exportedDatas.forEach(data => {
          data[i] = data[exportColumns[i].field];
        });
      }
      exportedDatas.map((data) => {
        let sizeOfFields: number = Object.keys(data).length;
        let i: number = 0;
        for (let property in data) {
          if (i > (sizeOfFields / 2) - 1) {
            delete data[property];
          }
          i++;
        }
        return data;
      });
      const worksheet = xlsx.utils.json_to_sheet(exportedDatas);
      xlsx.utils.sheet_add_aoa(worksheet, headers);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.stateKey);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    var FileSaver = require('file-saver');
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  isButton(column: Column) {
    return column.type === ColumnType.BUTTON;
  }

  clickEvent(rowData: any, column: Column) {
    let data: any = {
      field: column.field,
      row: rowData
    };
    this.onButtonClickEvent.emit(data);
  }

  clickEvent2(rowData: any, column: Column) {
    let data: any = {
      field: column.field,
      row: rowData
    };
    this.onButtonClickEvent2.emit(data);
  }

  showFilter() {
    return filter(this.allColumns, function (column: Column) {
      return column.filter === true
    }).length > 0;
  }
}
