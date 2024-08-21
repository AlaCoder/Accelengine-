import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

// Models
import { AEWorkflow } from 'accelengine-lib'
import { Column, ColumnType } from '@app/accelengine-shared/components/data-table/data-table.model';
import { WorkflowHistory } from '@app/accelengine-modules/module-workflow/models/workflowHistory.model';

// Service
import { AEWorkflowService } from '@app/accelengine-core/services/aeworkflow.service';


@Component({
  selector: 'app-workflow-history',
  templateUrl: './workflow-history.component.html',
  styleUrls: ['./workflow-history.component.scss']
})
export class WorkflowHistoryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data: AEWorkflow;
  @Output() onHistoriesLoaded: EventEmitter<any> = new EventEmitter();

  valueHistory: WorkflowHistory[] = [];
  columnsHistory: Column[];
  subscription: Subscription;

  constructor(private aeWorkflowService: AEWorkflowService) {
    this.columnsHistory = Column.fromObjects([
      { field: 'fromStatus', header: 'De' },
      { field: 'toStatus', header: 'Vers' },
      { field: 'executor.profile.fullname', header: 'Compte' },
      { field: 'description', header: 'Commentaire' },
      { field: 'date', header: 'Date', type: ColumnType.DATETIME, format: "DD/MM/YYYY HH:mm" },
      { field: 'durationConverted', header: 'Durée (JJ:HH:MM:SS)', type: ColumnType.STRING }
    ]);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue && changes.data.currentValue["id"]) {
      if (changes.data.previousValue && changes.data.previousValue.id === changes.data.currentValue["id"]) {
        return;
      }
      this.subscription = this.aeWorkflowService.findHistoryDTO(this.data.id).subscribe((result: WorkflowHistory[]) => {
        if (result) {
          this.valueHistory = result;
          this.valueHistory.forEach((history: WorkflowHistory) => {
            history["durationConverted"] = this.aeWorkflowService.convertDurationToString(history.duration);
          });
          this.onHistoriesLoaded.emit(this.valueHistory);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
