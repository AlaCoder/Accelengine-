// Created by Skander-INTELLIJ

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as moment from "moment";
import { InputForm } from './input-form';

@Component({
    selector: 'app-date-form',
    templateUrl: './input-date.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class InputDateComponent extends InputForm implements OnInit {

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
        const self = this;
        if (this.value) {
            self.getValueString(this.value.value);
        }
        var form = self.formGroup.get(this.name);
        if (form) {
            form.valueChanges.subscribe(value => {
                self.getValueString(value);
            });
        }
    }

    getValueString(date) {
        if (date !== null && date !== '') {
            this.dateValue = new Date(date);
            //this.dateString = moment(date).format(this.dateFormat);
            this.dateString = moment(date).format("DD/MM/YYYY");
        } else {
            this.dateValue = null;
            this.dateString = '';
        }
        this.ref.detectChanges();
    }

    onValueChangeDate(date) {
        if (date != null) {
            var newDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
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
