import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppTopBarComponent } from '@app/accelengine-verona/app.topbar.component';

// Services
import { TopbarMenuService } from '@app/accelengine-verona/app.topbarmenu.service';

// Helpers
//import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-menu-bookmark',
  templateUrl: './menu-bookmark.component.html',
  styleUrls: ['./menu-bookmark.component.scss']
})
export class MenuBookmarkComponent implements OnInit {
  selected: boolean = false;

  constructor(
    private topbarMenuService: TopbarMenuService,
    private router: Router) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.selected = this.topbarMenuService.isBookmark(this.router.url);
    }, 500);
  }

  onBookmark() {
    this.selected = !this.selected;
    this.topbarMenuService.onBookmark();
  }

  getClass() {
    if (this.selected) return 'p-button-rounded button-bookmark'
    else return 'p-button-rounded button-bookmark p-button-outlined'
  }

}
