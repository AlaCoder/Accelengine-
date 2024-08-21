import { AEEntity } from 'accelengine-lib';

export class CTable extends AEEntity {
    name: string;
    datasourceTableId: number;
    codeDatasource: string;
    columns: CColumn[] = [];
    fullCode?: string;
}

export class TableDTO {
    id: number;
    code: string;
    name: string;
    metadata: boolean;
    columns: string[];
    types: string[];
    loaded: boolean;
    rowNbr: number;
}

export class CColumn extends AEEntity {
    name: string;
    type: COLUMN_TYPE;
    typeString: string;
    typeInt: string;
    fullCode?: string;

    getType(): COLUMN_TYPE {
        switch (this.typeString) {
            case 'long':
            case 'int8':
                return COLUMN_TYPE.LONG;
            case 'int4':
                return COLUMN_TYPE.INTEGER;
            case 'float4':
                return COLUMN_TYPE.FLOAT;
            case 'bool':
                return COLUMN_TYPE.BOOLEAN;
            case 'java.util.Date':
                return COLUMN_TYPE.DATE;
            case 'timestamp':
                return COLUMN_TYPE.DATETIME;
            default:
                return COLUMN_TYPE.STRING;
        }
    }
}

export enum COLUMN_TYPE {
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    STRING = "STRING",
    LONG = "LONG",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    DATETIME = "DATETIME"
}

export const COLUMN_TYPE_LIST: any[] = [
    { code: COLUMN_TYPE.INTEGER, label: 'INTEGER' },
    { code: COLUMN_TYPE.FLOAT, label: 'FLOAT' },
    { code: COLUMN_TYPE.STRING, label: 'STRING' },
    { code: COLUMN_TYPE.LONG, label: 'LONG' },
    { code: COLUMN_TYPE.BOOLEAN, label: 'BOOLEAN' },
    { code: COLUMN_TYPE.DATE, label: 'DATE' },
    { code: COLUMN_TYPE.DATE, DATETIME: 'DATETIME' }
];

