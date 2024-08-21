import { AEAuditingEntity, AEEntity } from 'accelengine-lib';

export class Report extends AEEntity {

    name: string;
    description: string;
    moduleName: string;
    fileName: string;
    reportType: ReportType;
}

export enum ReportType {

    PDF = "PDF"

}
export class ReportParameter extends AEEntity {
    name: string;
    value: string;
}
export class ReportRequestDto {
    name: string;
    data: any[];
    parameters: ReportParameter[];
}