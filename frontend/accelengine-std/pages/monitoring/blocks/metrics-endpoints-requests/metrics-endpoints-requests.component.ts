import { Component, Input } from '@angular/core';
import { Services } from '@std/models/monitoring.model';


@Component({
  selector: 'jhi-metrics-endpoints-requests',
  templateUrl: './metrics-endpoints-requests.component.html',
})
export class MetricsEndpointsRequestsComponent {

  @Input() endpointsRequestsMetrics?: Services;
  @Input() updating?: boolean;
}
