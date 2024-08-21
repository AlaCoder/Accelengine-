import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

// Models
import { Permission } from '@core/models/account.model';
import { Action, Document } from '@app/accelengine-std/models/application.model';

// Services
import { RoleService } from '@std/services/role.service';
import { ActionService } from '@app/accelengine-std/services/action.service';
import { DocumentService } from '@app/accelengine-std/services/document.service';

// Component
import { FormPopupComponent } from 'accelengine-lib';

// Helpers
import { Logger } from 'accelengine-lib';
const log = new Logger('PermissionFormComponent');

@Component({
  templateUrl: 'permission-form.component.html'
})
export class PermissionFormComponent extends FormPopupComponent<Permission> implements OnInit {

  documents: Document[] = [];
  actions: Action[] = [];

  constructor(injector: Injector,
    private roleService: RoleService,
    private documentService: DocumentService,
    private actionService: ActionService) {
    super(injector, Permission);

    this.formGroup = this.formBuilder.group({
      document: [this.data.document, [Validators.required]],
      action: [this.data.action, [Validators.required]]
    });

  }

  ngOnInit() {
    log.info('ngOnInit PermissionFormComponent', this.data);

    this.documentService.getAllActivate().subscribe(result => {
      log.debug(result);
      if (result) {
        this.documents = result.datas;
      }
    });

    this.actionService.getAllActivate().subscribe(result => {
      log.debug(result);
      if (result) {
        this.actions = result.datas;
      }
    });

    if (this.data) {
      this.formGroup.patchValue(this.data);
    }

  }
}
