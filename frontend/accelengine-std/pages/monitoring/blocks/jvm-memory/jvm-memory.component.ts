import { Component, Input } from '@angular/core';
import { NumberHelperService } from '@app/accelengine-core/utilities/number.helper.service';


import { JvmMetrics } from '@std/models/monitoring.model';

@Component({
  selector: 'jvm-memory',
  templateUrl: './jvm-memory.component.html',
})
export class JvmMemoryComponent {
  @Input() jvmMemoryMetrics?: { [key: string]: JvmMetrics };
  @Input() updating?: boolean;

  constructor(private numberHelperService: NumberHelperService) { }

  round(input) {
    return this.numberHelperService.round(input, 2);
  }

}
