import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NumberHelperService } from '@app/accelengine-core/utilities/number.helper.service';
import { CacheMetrics } from '@std/models/monitoring.model';

@Component({
  selector: 'jhi-metrics-cache',
  templateUrl: './metrics-cache.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsCacheComponent {

  @Input() cacheMetrics?: { [key: string]: CacheMetrics };
  @Input() updating?: boolean;

  constructor(private numberHelperService: NumberHelperService) { }

  filterNaN(input) {
    return this.numberHelperService.filterNaN(input);
  };
}