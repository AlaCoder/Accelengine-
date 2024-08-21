import { Component, Injector, OnInit } from '@angular/core';

//Component
import { FormPopupComponent } from 'accelengine-lib';

//Models
import { WorkflowStatus } from 'accelengine-lib';

//Services

// Helpers
import { Logger } from 'accelengine-lib';
import { Validators } from '@angular/forms';
import { APP_CONFIG } from '@app/app.config';

const log = new Logger('PermissionFormComponent');

@Component({
  selector: 'app-workflow-status-form',
  templateUrl: './workflow-status-form.component.html'
})
export class WorkflowStatusFormComponent extends FormPopupComponent<WorkflowStatus> implements OnInit {

  public colors = APP_CONFIG.colors.colors2;

  constructor(injector: Injector) {
    super(injector, WorkflowStatus)

    this.formGroup = this.formBuilder.group({
      id: [this.data.id],
      code: [this.data.code, [Validators.required]],
      label: [this.data.label, [Validators.required]],
      statusOrder: [this.data.statusOrder],
      color: [this.data.color],
      estimation: [this.data.estimation, [Validators.pattern("^[0-9]+\-([0-2][0-3]|[0-1][0-9])\-[0-5][0-9]")]]
    });
  }

  ngOnInit(): void {
    log.info('ngOnInit WorkflowStatusFormComponent', this.data);
    if (this.data) {
      this.formGroup.patchValue(this.data);
    }
  }

}
