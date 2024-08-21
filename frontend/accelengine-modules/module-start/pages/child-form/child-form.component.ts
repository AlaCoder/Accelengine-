import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Models
import { Child } from '../../models/father.model';

// Services
import { RoleService } from '@app/accelengine-std/services/role.service';

// Component
import { FormPopupComponent } from 'accelengine-lib';

// Helpers
import { Logger } from 'accelengine-lib';
const log = new Logger('ChildFormComponent');

@Component({
  templateUrl: 'child-form.component.html'
})
export class ChildFormComponent extends FormPopupComponent<Child> implements OnInit {

  constructor(injector: Injector,
    private roleService: RoleService) {
    super(injector, Child);

    this.formGroup = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
    });

  }

  ngOnInit() {
    log.info('ngOnInit ChildFormComponent', this.data);
    if (this.data) {
      this.formGroup.patchValue(this.data);
    }

  }
}
