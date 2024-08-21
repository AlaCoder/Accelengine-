import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import * as moment from 'moment';
import { InputForm } from './input-form';

@Component({
  selector: 'app-input-date-time',
  templateUrl: './input-date-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateTimeComponent extends InputForm {

  @Input() dateFormat: string = "dd/mm/yy";
  @Input() set minDate(minDate: Date) {
    if (minDate) {
      this.minDateValue = minDate;
      this.minYear = this.minDateValue.getFullYear();
    }
  }
  @Input() set maxDate(maxDate: Date) {
    if (maxDate) {
      this.maxDateValue = maxDate;
      this.maxYear = this.maxDateValue.getFullYear();
    }
  }
  @Input() disabledDays: number[] = [];
  @Input() disabledDates: Date[] = [];
  @Input() hourFormat: number = 24;
  @Input() timeOnly: boolean = false


  dateString: string = '';
  dateValue: Date;
  minDateValue: Date = new Date();
  maxDateValue: Date = new Date();

  minYear: number;
  maxYear: number;

  constructor(private ref: ChangeDetectorRef) {
    super();
    let today = new Date();
    let year = today.getFullYear();
    this.minYear = year - 10;
    this.maxYear = year + 10;
    this.minDateValue.setFullYear(this.minYear);
    this.maxDateValue.setFullYear(this.maxYear);
    this.disabledDays.push(0, 6);
  }

  ngOnInit() {
    this.getValueString(this.value.value);
    this.formGroup.get(this.name).valueChanges.subscribe(value => {
      this.getValueString(value);
    });
  }

  getValueString(date) {
    if (date !== null) {
      this.dateValue = new Date(date);
      let displayedFormat: string = "DD/MM/YYYY HH:mm:ss";
      if (this.timeOnly) {
        displayedFormat = "HH:mm:ss";
      }
      this.dateString = moment(date).format(displayedFormat);
    } else {
      this.dateValue = null;
      this.dateString = '';
    }
    this.ref.detectChanges();
  }

  onValueChangeDate(date: Date) {
    if (date != null) {
      let year: number;
      let month: number;
      let day: number;
      let hours: number = date.getHours();
      let minutes: number = date.getMinutes();
      let secondes: number = date.getSeconds();
      let newDate: Date;
      if (this.timeOnly) {
        let today: Date = new Date();
        year = today.getFullYear();
        month = today.getMonth();
        day = today.getDate();
      } else {
        year = date.getFullYear();
        month = date.getMonth();
        day = date.getDate();
      }
      newDate = new Date(Date.UTC(year, month, day, hours - 1, minutes, secondes));
      this.formGroup.get(this.name).setValue(newDate);
      this.onChange.emit(newDate);
    } else {
      this.formGroup.get(this.name).setValue(null);
      this.onChange.emit(null);
    }
  }

  getYearRange() {
    return this.minYear + ':' + this.maxYear;
  }
}
