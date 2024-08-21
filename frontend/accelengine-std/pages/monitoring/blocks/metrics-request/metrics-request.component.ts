import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NumberHelperService } from '@app/accelengine-core/utilities/number.helper.service';
import { HttpServerRequests } from '@std/models/monitoring.model';

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsRequestComponent {

  @Input() requestMetrics?: HttpServerRequests;
  @Input() updating?: boolean;

  constructor(private numberHelperService: NumberHelperService) { }

  filterNaN(input) {
    return this.numberHelperService.filterNaN(input);
  };

  round(input) {
    return this.numberHelperService.round(input, 2);
  }
}
