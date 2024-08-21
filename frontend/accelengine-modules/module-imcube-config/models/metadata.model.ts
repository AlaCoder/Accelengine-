import { AEEntity, AEAuditingEntity } from 'accelengine-lib';
import { CTable, CColumn, COLUMN_TYPE } from './table.model';

export class CMetadata extends AEAuditingEntity {
    description: string;
    tables: CTable[] = [];
    factTable: CTable
    tablesNames: string;
    joins: CJoin[] = [];
    ccs: CCColumn[] = [];
}

export class CJoin extends AEEntity {
    parentTable: CTable;
    parentColumn: CColumn;
    parentTableCode: string;
    childTable: CTable;
    childTableCode: string;
    childColumn: CColumn;
    type: JOIN_TYPE;
}

export class CCColumn extends AEEntity {
    name: string;
    type: COLUMN_TYPE;
    expression: string;
    paramColumns: CColumn[] = [];
}

export enum JOIN_TYPE {
    INNER = "INNER",
    OUTER = "OUTER"
}

export const JOIN_TYPE_LIST: any[] = [
    { code: JOIN_TYPE.INNER, label: 'INNER' },
    { code: JOIN_TYPE.OUTER, label: 'OUTER' }
];