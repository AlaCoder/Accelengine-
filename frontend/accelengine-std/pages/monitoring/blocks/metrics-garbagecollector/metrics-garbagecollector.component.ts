import { Component, Input } from '@angular/core';
import { NumberHelperService } from '@app/accelengine-core/utilities/number.helper.service';
import { GarbageCollector } from '@std/models/monitoring.model';

@Component({
  selector: 'jhi-metrics-garbagecollector',
  templateUrl: './metrics-garbagecollector.component.html',
})
export class MetricsGarbageCollectorComponent {

  @Input() garbageCollectorMetrics?: GarbageCollector;
  @Input() updating?: boolean;

  constructor(private numberHelperService: NumberHelperService) { }

  round(input) {
    return this.numberHelperService.round(input, 2);
  }
}
