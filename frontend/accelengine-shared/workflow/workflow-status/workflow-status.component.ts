import { Component, Injector, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Components
import { FormComponent, WorkflowStatus } from 'accelengine-lib'

// Models
import { Account } from '@app/accelengine-core/models/account.model';
import { Workflow, WorkflowTransition } from '@app/accelengine-modules/module-workflow/models/workflow.model';
import { AEWorkflow } from 'accelengine-lib'

// Services
import { StorageService } from '@app/accelengine-core/services/storage.service';
import { TransitionService } from '@app/accelengine-modules/module-workflow/services/workflow-transition.service';
import { WorkflowService } from '@app/accelengine-modules/module-workflow/services/workflow.service';
import { AEWorkflowService } from '@app/accelengine-core/services/aeworkflow.service';

// Helpers
import { Logger } from 'accelengine-lib';
import { APP_CONFIG } from '@app/app.config';
const log = new Logger('WorkflowStatusComponent');

@Component({
  selector: 'app-workflow-status',
  templateUrl: './workflow-status.component.html',
  styleUrls: ['./workflow-status.component.scss'],
  animations: APP_CONFIG.app.animations
})
export class WorkflowStatusComponent extends FormComponent<AEWorkflow> implements OnChanges, OnInit {

  @Input() currentObject: AEWorkflow;
  @Input() formGroup: FormGroup;
  @Input() classObject: string;
  @Input() isEdit: boolean = false;
  @Input() isSubmitted: boolean = false;
  @Input() displayRedirect: boolean = false;
  @Output() onWorkflowChanged: EventEmitter<any> = new EventEmitter<any>();

  showDescription: boolean = false;
  newAEWorkflow: AEWorkflow = new AEWorkflow();

  transitions: WorkflowTransition[] = [];
  listRoles: number[] = [];
  currentWorkflow: Workflow;
  currentAccount: Account;

  constructor(private injector: Injector,
    private transitionService: TransitionService,
    private workflowService: WorkflowService,
    private storageService: StorageService,
    private aeWorkflowService: AEWorkflowService
  ) {
    super(injector, AEWorkflow);
    this.formGroup = this.formBuilder.group({
      newStatus: [this.currentObject?.newStatus],
      detailsNewStatus: [null],
      descriptionTransition: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes["formGroup"] && changes["formGroup"].currentValue) {
      this.formGroup = changes["formGroup"].currentValue;
      this.addControls();
    }
  }

  addControls(): void {
    let formControlNewStatus: FormControl = new FormControl(this.currentObject?.newStatus);
    let formControlDetailsNewStatus: FormControl = new FormControl(null);
    let formControlDescriptionTransition: FormControl = new FormControl(null);
    this.formGroup.addControl("newStatus", formControlNewStatus);
    this.formGroup.addControl("detailsNewStatus", formControlDetailsNewStatus);
    this.formGroup.addControl("descriptionTransition", formControlDescriptionTransition);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.workflowService.findActiveWorkflowByDocumentCode(this.classObject).subscribe((result: Workflow) => {
      if (result) {
        this.currentWorkflow = result;
        if (this.currentObject && this.currentObject.id) {
          this.subscriptions.push(this.aeWorkflowService.getByID(this.currentObject.id).subscribe((aeWorkflow: AEWorkflow) => {
            if (aeWorkflow) {
              this.f.detailsNewStatus.setValue(aeWorkflow.newStatus?.label)
              this.currentAccount = this.storageService.getCurrentAccount();
              let roles = this.currentAccount.roles.map(x => x.id);
              if (aeWorkflow && aeWorkflow.newStatus) {
                this.subscriptions.push(this.transitionService.findAllBySourceAndRoles(aeWorkflow?.newStatus?.id, roles, this.classObject).subscribe(
                  (res: WorkflowTransition[]) => {
                    this.transitions = res;
                  }
                ));
              }
            }
          }));
        }
      }
      else {
        this.currentWorkflow = null;
      }
    }));
  }

  statusChanged(status: WorkflowStatus) {
    //this.f.descriptionTransition.setValue("");
    if (status) {
      if (this.transitions && this.transitions.length) {
        let selectedTransition: WorkflowTransition = this.transitions.find((transition: WorkflowTransition) => transition.toStatus && transition.toStatus.id === status.id);
        if (selectedTransition && selectedTransition.commentIsRequired) {
          this.formGroup.get("descriptionTransition").setValidators([Validators.required]);
          this.formGroup.get("descriptionTransition").updateValueAndValidity();
        } else {
          this.formGroup.get("descriptionTransition").clearValidators();
          this.formGroup.get("descriptionTransition").updateValueAndValidity();
        }
      }
      this.newAEWorkflow.newStatus = status
      //this.newAEWorkflow.descriptionTransition = "";
      this.showDescription = true;
    }
    else {
      this.newAEWorkflow.newStatus = null;
      this.showDescription = false;
    }
    this.onWorkflowChanged.emit(this.newAEWorkflow);
  }

  changeComment(comment) {
    if (this.newAEWorkflow && this.newAEWorkflow.newStatus && comment) {
      this.newAEWorkflow.descriptionTransition = comment;
      this.onWorkflowChanged.emit(this.newAEWorkflow);
    }
  }

  onSaveClick() { }
}
