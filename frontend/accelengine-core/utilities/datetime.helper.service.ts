import { Injectable } from "@angular/core";
import * as moment from 'moment';

@Injectable({ providedIn: "root" })
export class DatetimeHelperService {
    constructor() { }

    public nowWithoutTime() {
        return this.withoutTime(new Date());
    }

    public withoutTime(dateTime: Date) {
        var m = moment.utc(dateTime);
        var utcOffset = moment().utcOffset();
        m.add(utcOffset, "minutes");
        m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        return m.toDate();

    }

    public isWeekEnd(date:Date) {
        if (date.getDay() == 6 || date.getDay() == 0){
            return true ;
        }
        return false;
    }

    public isSunday(date: Date) {
        if (date.getDay() == 0) {
            return true;
        }
        return false;
    }
}
