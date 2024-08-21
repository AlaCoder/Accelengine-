import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NumberHelperService } from '@app/accelengine-core/utilities/number.helper.service';
import { Databases } from '@std/models/monitoring.model';


@Component({
  selector: 'jhi-metrics-datasource',
  templateUrl: './metrics-datasource.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsDatasourceComponent {

  @Input() datasourceMetrics?: Databases;
  @Input() updating?: boolean;

  constructor(private numberHelperService: NumberHelperService) { }

  filterNaN(input) {
    return this.numberHelperService.filterNaN(input);
  };
}

