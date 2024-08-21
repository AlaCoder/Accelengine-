import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InputForm } from '../forms/input-form';

// Models
import { AEStatusType } from '@app/accelengine-std/models/aestatus-type.model';
import { AEStatus } from '@app/accelengine-std/models/aestatus.model';

// Services
import { AEStatusTypeService } from '@app/accelengine-std/services/status-type.service';


@Component({
  selector: 'app-status-select',
  templateUrl: './status-select.component.html',
})
export class StatusSelectComponent extends InputForm implements OnInit, OnDestroy {

  @Input() dataKey: string = 'id';
  @Input() placeholder: string;
  @Input() displayField: string = 'label';
  @Input() returnValue: string;
  @Input() isSubmitted: boolean = false;
  @Input() isDisabled: boolean;
  @Input() group: boolean;
  @Input() displayLabel: boolean = true;
  @Input() typeCode: string;
  @Input() codeStatus: string;
  @Input() showClear: boolean = true;
  @Input() autoDisplayFirst: boolean = false;
  @Input() emptyFilterMessage: string = "Liste vide !";
  @Input() filter: boolean = true;

  statuses: AEStatus[] = [];
  subscription: Subscription;

  constructor(
    private dictionaryTypeService: AEStatusTypeService
  ) {
    super();
  }


  ngOnInit(): void {
    this.subscription = this.dictionaryTypeService.findOneByCodeDocumentAndCode(this.typeCode, this.codeStatus).subscribe((res: AEStatusType) => {
      if (res)
        this.statuses = res.statuses;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
