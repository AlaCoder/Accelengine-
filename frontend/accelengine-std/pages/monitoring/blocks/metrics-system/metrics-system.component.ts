import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NumberHelperService } from '@app/accelengine-core/utilities/number.helper.service';
import { ProcessMetrics } from '@std/models/monitoring.model';

@Component({
  selector: 'jhi-metrics-system',
  templateUrl: './metrics-system.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsSystemComponent {

  @Input() systemMetrics?: ProcessMetrics;
  @Input() updating?: boolean;

  constructor(private numberHelperService: NumberHelperService) { }

  convertMillisecondsToDuration(ms: number): string {
    const times = {
      year: 31557600000,
      month: 2629746000,
      day: 86400000,
      hour: 3600000,
      minute: 60000,
      second: 1000,
    };
    let timeString = '';
    for (const [key, value] of Object.entries(times)) {
      if (Math.floor(ms / value) > 0) {
        let plural = '';
        if (Math.floor(ms / value) > 1) {
          plural = 's';
        }
        timeString += `${Math.floor(ms / value).toString()} ${key.toString()}${plural} `;
        ms = ms - value * Math.floor(ms / value);
      }
    }
    return timeString;
  }

  round(input) {
    return this.numberHelperService.round(input, 2);
  }
}
