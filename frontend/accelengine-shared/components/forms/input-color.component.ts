import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InputForm } from './input-form';
import { ColorEvent } from 'ngx-color';

// Helpers
//import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-color-form',
  templateUrl: './input-color.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputColorComponent extends InputForm {

  @Input() colors: string;

  constructor() {
    super();
  }


  getStyle() {
    return {
      'background-color': this.value.value,
      height: '30px%',
      width: '100%'
    }
  }


  onColorChange(color: ColorEvent) {
    this.value.setValue(color.color.hex);
  }
}
