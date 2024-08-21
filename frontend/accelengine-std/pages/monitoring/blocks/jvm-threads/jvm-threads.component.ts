import { Component, Input } from '@angular/core';
import { NumberHelperService } from '@app/accelengine-core/utilities/number.helper.service';
import { Thread, ThreadState } from '@std/models/monitoring.model';


@Component({
  selector: 'jhi-jvm-threads',
  templateUrl: './jvm-threads.component.html',
})
export class JvmThreadsComponent {

  display: boolean = false;

  threadStats = {
    threadDumpAll: 0,
    threadDumpRunnable: 0,
    threadDumpTimedWaiting: 0,
    threadDumpWaiting: 0,
    threadDumpBlocked: 0,
  };

  ThreadState = ThreadState;
  threadStateFilter?: ThreadState;
  threadDumpAll = 0;
  threadDumpBlocked = 0;
  threadDumpRunnable = 0;
  threadDumpTimedWaiting = 0;
  threadDumpWaiting = 0;

  @Input()
  set threads(threads: Thread[] | undefined) {
    this._threads = threads;

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

    threads?.forEach(thread => {
      if (thread.threadState === ThreadState.Runnable) {
        this.threadStats.threadDumpRunnable += 1;
      } else if (thread.threadState === ThreadState.Waiting) {
        this.threadStats.threadDumpWaiting += 1;
      } else if (thread.threadState === ThreadState.TimedWaiting) {
        this.threadStats.threadDumpTimedWaiting += 1;
      } else if (thread.threadState === ThreadState.Blocked) {
        this.threadStats.threadDumpBlocked += 1;
      }
    });

    this.threadStats.threadDumpAll = this.threadStats.threadDumpRunnable + this.threadStats.threadDumpWaiting + this.threadStats.threadDumpTimedWaiting + this.threadStats.threadDumpBlocked;

    this.threadStats.threadDumpRunnable = this.threadStats.threadDumpRunnable * 100 / this.threadStats.threadDumpAll;
    this.threadStats.threadDumpWaiting = this.threadStats.threadDumpWaiting * 100 / this.threadStats.threadDumpAll;
    this.threadStats.threadDumpTimedWaiting = this.threadStats.threadDumpTimedWaiting * 100 / this.threadStats.threadDumpAll;
    this.threadStats.threadDumpBlocked = this.threadStats.threadDumpBlocked * 100 / this.threadStats.threadDumpAll;

  }

  get threads(): Thread[] | undefined {
    return this._threads;
  }

  private _threads: Thread[] | undefined;

  constructor(private numberHelperService: NumberHelperService) { }

  open(): void {
    this.display = true;
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

  round(input) {
    return this.numberHelperService.round(input, 2);
  }
}
