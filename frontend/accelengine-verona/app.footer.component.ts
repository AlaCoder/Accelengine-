import { Component, OnInit } from '@angular/core';

// Models
import { Application } from '@std/models/application.model';

// Services
import { MenuSaveService } from 'accelengine-lib';
import { TranslateService } from '@ngx-translate/core';

// Helpers

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html'
})
export class AppFooterComponent implements OnInit {
  application: Application;
  showSave: boolean = false;
  isValide: boolean = false;
  footerMessage: string;

  public closeBtnLabel: string = 'label.cancel';
  public saveBtnLabel: string = 'label.save';

  constructor(
    private menuSaveService: MenuSaveService,
    private translateService: TranslateService) {

    this.menuSaveService.showSave.subscribe(showSave => {
      this.showSave = showSave;
    });

    this.menuSaveService.isValide.subscribe(isValide => {
      this.isValide = isValide;
    });

    this.menuSaveService.closeBtnLabel.subscribe(closeBtnLabel => {
      if (closeBtnLabel) {
        this.closeBtnLabel = closeBtnLabel;
      }
    });

    this.menuSaveService.saveBtnLabel.subscribe(saveBtnLabel => {
      if (saveBtnLabel) {
        this.saveBtnLabel = saveBtnLabel;
      }

    });
  }

  ngOnInit() {
    let currentYear: number = new Date().getFullYear();
    this.footerMessage = this.translateService.instant("APP.FOOTER_COPYRIGHT");
    this.footerMessage = this.footerMessage.replace("$currentYear", currentYear + "");
  }

  onSaveClick($event) {
    this.menuSaveService.onClick.next($event);
  }
}
