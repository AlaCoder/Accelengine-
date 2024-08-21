import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';

// Model
import { CWidget, CWidgetColumn } from '../../../models/widget.model';

// Service
import { WidgetService } from '../../../services/widget.service';

// Helpers

@Component({
  selector: 'app-widget-view',
  templateUrl: './widget-view.component.html',
  styleUrls: ['./widget-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetViewComponent {

  @Input() set load(load: boolean) {
    if (load) {
      setTimeout(() => {
        //if (this.currentWidget !== undefined)
        this.loadDatas();
      }, 500);
    }
  }

  @Input() set widget(widget: CWidget) {
    if (widget) {
      this.currentWidget = cloneDeep(widget);
      // this.currentWidget.filters = []; // to remove
    }
  }

  @Input() set filters(newFilters: CWidgetColumn[]) {
    this.currentFilters = [];
    if (newFilters) {
      this.currentFilters = newFilters;
    }
  }

  currentWidget: CWidget;
  datasIsLoading: boolean = false;
  currentFilters: CWidgetColumn[] = [];

  constructor(
    private widgetService: WidgetService,
    private changeRef: ChangeDetectorRef) {
  }

  loadDatas() {
    this.datasIsLoading = true;
    if (this.currentFilters.length > 0) {
      this.currentWidget.filters = [...this.currentWidget.filters, ...this.currentFilters];
    } else {
      this.currentWidget.filters
    }
    this.widgetService.executFromWidget(this.currentWidget).subscribe((results) => {
      if (results) {
        this.currentWidget = results;
        this.datasIsLoading = false;
        this.changeRef.markForCheck();
      }
    });
  }

  onNodesPathChanged(nodesPath: string[]) {
    this.currentWidget.nodesPath = nodesPath;
    this.currentWidget.nodesPathString = nodesPath.toString();
    this.currentWidget.datas = [];
    this.widgetService.executFromWidget(this.currentWidget).subscribe((results) => {
      if (results) {
        this.currentWidget = results;
        this.changeRef.markForCheck();
      }
    });
  }

}
