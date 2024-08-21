import { AEAuditingEntity } from 'accelengine-lib';

export class FileParam extends AEAuditingEntity {
	type: FILE_TYPE;
	version: string;
	description: Text;
	extension: string;
	separator: string;
	lines: LineParam[] = [];
}

export class LineParam extends AEAuditingEntity {
	type: string;
	description: string;
	display: boolean;
	fields: FieldParam[] = [];
}

export class FieldParam extends AEAuditingEntity {
	type: FIELD_TYPE;
	description: string;
	order: number;
	obligatory: Boolean;
	length: number;
	formatting: string;
	format: string;
	display: boolean;
}

export enum FILE_TYPE {
    CSV = "CSV",
    EDI = "EDI"
}

export const FILE_TYPE_LIST: any = [
    { code: FILE_TYPE.CSV, label: 'CSV' },
    { code: FILE_TYPE.EDI, label: 'EDI' }
];

export enum FIELD_TYPE {
    STRING = "STRING",
    INTEGER = "INTEGER",
	DATE = "DATE"
}

export const FIELD_TYPE_LIST: any = [
    { code: FIELD_TYPE.STRING, label: 'String' },
    { code: FIELD_TYPE.INTEGER, label: 'Integer' },
	{ code: FIELD_TYPE.DATE, label: 'Date' }
];