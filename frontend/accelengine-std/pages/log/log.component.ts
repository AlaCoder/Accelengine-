import { Component, Injector, OnInit } from '@angular/core';

// Models
import { Setting } from '@app/accelengine-std/models/application.model';

// Components
import { BaseComponent } from 'accelengine-lib';

// Services
import { SettingService } from '@app/accelengine-std/services/setting.service';

// Helpers
import { Logger } from 'accelengine-lib';

const log = new Logger('LogComponent');
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent extends BaseComponent implements OnInit {

  logDirPath: string;

  constructor(private injector: Injector,
    private settingService: SettingService) {
    super(injector);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.settingService.getByCode("KEY_LOG_DIR_PATH").subscribe((setting: Setting) => {
      if (setting) {
        this.logDirPath = setting.valueString;
      }
    }));
  }
}
