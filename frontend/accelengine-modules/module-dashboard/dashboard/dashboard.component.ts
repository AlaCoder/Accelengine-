import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Models

// Services

// Helpers
import { Logger } from 'accelengine-lib';

const log = new Logger('DashboardComponent');
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  
  isDelegate: boolean = false; 

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

}
