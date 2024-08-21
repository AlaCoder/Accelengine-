import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Thread, ThreadState } from '@std/models/monitoring.model';


@Component({
  selector: 'threads-details',
  templateUrl: './threads-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadsDetailsComponent implements OnInit {
  ThreadState = ThreadState;
  threadStateFilter?: ThreadState;
  threads?: Thread[];
  threadDumpAll = 0;
  threadDumpBlocked = 0;
  threadDumpRunnable = 0;
  threadDumpTimedWaiting = 0;
  threadDumpWaiting = 0;

  constructor() { }

  ngOnInit(): void {
    this.threadDumpAll = 0;
    this.threadDumpBlocked = 0;
    this.threadDumpRunnable = 0;
    this.threadDumpTimedWaiting = 0;
    this.threadDumpWaiting = 0;

    this.threads?.forEach(thread => {
      if (thread.threadState === ThreadState.Runnable) {
        this.threadDumpRunnable += 1;
      } else if (thread.threadState === ThreadState.Waiting) {
        this.threadDumpWaiting += 1;
      } else if (thread.threadState === ThreadState.TimedWaiting) {
        this.threadDumpTimedWaiting += 1;
      } else if (thread.threadState === ThreadState.Blocked) {
        this.threadDumpBlocked += 1;
      }
    });

    this.threadDumpAll = this.threadDumpRunnable + this.threadDumpWaiting + this.threadDumpTimedWaiting + this.threadDumpBlocked;
  }

  getBadgeClass(threadState: ThreadState): string {
    if (threadState === ThreadState.Runnable) {
      return 'badge-success';
    } else if (threadState === ThreadState.Waiting) {
      return 'badge-info';
    } else if (threadState === ThreadState.TimedWaiting) {
      return 'badge-warning';
    } else if (threadState === ThreadState.Blocked) {
      return 'badge-danger';
    }
    return '';
  }

  getThreads(): Thread[] {
    return this.threads?.filter(thread => !this.threadStateFilter || thread.threadState === this.threadStateFilter) ?? [];
  }

}
