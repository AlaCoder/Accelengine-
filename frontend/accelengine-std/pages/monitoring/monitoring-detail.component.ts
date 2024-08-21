import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';

// Models
import { Metrics, Thread } from '@std/models/monitoring.model';

// Component

// Services
import { MonitoringService } from '@std/services/monitoring.service';


// Helpers
import { Logger } from 'accelengine-lib';


const log = new Logger('MonitoringDetailComponent');

@Component({
  templateUrl: 'monitoring-detail.component.html',
})
export class MonitoringDetailComponent implements OnInit {
  metrics?: Metrics;
  threads?: Thread[];
  updatingMetrics = true;

  constructor(
    private monitoringService: MonitoringService,
    private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
  }

  // Init
  initUI() {
    log.debug('Init UI');

  }

  initData() {
    log.debug('Init Data');
    this.updatingMetrics = false;
    combineLatest([this.monitoringService.getMetrics(), this.monitoringService.threadDump()]).subscribe(([metrics, threadDump]) => {
      this.metrics = metrics;
      this.threads = threadDump.threads;
      this.updatingMetrics = false;
      this.changeDetector.markForCheck();
    });


  }

  metricsKeyExists(key: keyof Metrics): boolean {
    return Boolean(this.metrics?.[key]);
  }

  metricsKeyExistsAndObjectNotEmpty(key: keyof Metrics): boolean {
    return Boolean(this.metrics?.[key] && JSON.stringify(this.metrics[key]) !== '{}');
  }

}
