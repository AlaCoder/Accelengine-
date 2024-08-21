import { AEAuditingEntity } from "accelengine-lib";

export class Holiday extends AEAuditingEntity {
    description: string;
    beginDate: string;
    endDate: string;
    year: number;
    isOneDay: boolean = true;
    holidayType: HOLIDAY_TYPE;
}
export enum HOLIDAY_TYPE {
    BILLABLE = "BILLABLE",
    NOT_BILLABLE = "NOT_BILLABLE",

}

export const HOLIDAY_TYPE_LIST: any = [
    { code: HOLIDAY_TYPE.BILLABLE, label: 'Chômé payé' },
    { code: HOLIDAY_TYPE.NOT_BILLABLE, label: 'Chômé non payé' },

];