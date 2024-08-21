import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Directive({
  selector: '[isDesktop]'
})
export class IsDesktopDirective implements OnInit {

  constructor(private deviceService: DeviceDetectorService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  ngOnInit() {
    if (this.deviceService.isDesktop()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}