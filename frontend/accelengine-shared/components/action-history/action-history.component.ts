import { Component, Input, OnInit } from '@angular/core';
import { AEAuditingEntity } from 'accelengine-lib';

@Component({
  selector: 'app-action-history',
  templateUrl: './action-history.component.html'
})
export class ActionHistoryComponent implements OnInit {

  @Input() entity: AEAuditingEntity;

  constructor() {
  }

  ngOnInit(): void {


  }


  ngOnDestroy(): void {

  }
}
