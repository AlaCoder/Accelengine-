import { AEEntity, AEAuditingEntity } from 'accelengine-lib';
import { CMetadata } from './metadata.model';
import { COLUMN_TYPE, CTable } from './table.model';

export class CWidget extends AEAuditingEntity {
    description: string;
    metadata: CMetadata;
    columns: CWidgetColumn[] = [];
    sortColumns: CWidgetColumn[] = [];
    rows: CWidgetColumn[] = [];
    pivs: CWidgetColumn[] = [];
    sortRows: CWidgetColumn[] = [];
    filters: CWidgetColumn[] = [];
    sorts: CWidgetColumn[] = [];
    widgetType: WIDGET_TYPE;
    nodesPath: string[] = [];
    nodesPathString: string;
    datas: any;
    samples: boolean;
    pivotHeaderNiv1: string[] = [];
    pivotHeaderNiv2: string[] = [];
    showLastLine: boolean = false;
}

export class CWidgetColumn extends AEEntity {
    name: string;
    type: COLUMN_TYPE;
    displayOrder: number;
    aggregation: AGGREGATION_TYPE;
    filter: CFilter;
    sort: SORT;
    formatting: FORMATTING_TYPE;
    table: CTable;
    val1: string = '';
    val2: string = '';
    val3: string = '';
    val4: string = '';
    val5: string = '';
    dictionary: boolean;
}

export class CFilter extends AEEntity {
    value: string;
    valueDate: Date;
    min: String;
    minDate: Date;
    max: String;
    maxDate: Date;
    values: string[];
    type: FILTER_TYPE;
}

export enum WIDGET_TYPE {
    TABLE = "TABLE",
    PIVOTTABLE = "PIVOTTABLE",
    PIVOTTABLE2 = "PIVOTTABLE2",
    CHART = "CHART",
    INDICATOR = "INDICATOR",
    GAUGE = "GAUGE",
    BAR = "BAR",
    PIE = "PIE"
}

export const WIDGET_TYPE_LIST: any[] = [
    { code: WIDGET_TYPE.TABLE, label: 'Tableau' },
    { code: WIDGET_TYPE.PIVOTTABLE, label: 'Tableau croisé dynamique' },
    { code: WIDGET_TYPE.PIVOTTABLE2, label: 'Tableau croisé dynamique 2' },
    { code: WIDGET_TYPE.CHART, label: 'Graphique' },
    { code: WIDGET_TYPE.INDICATOR, label: 'Indicateur' },
    { code: WIDGET_TYPE.GAUGE, label: 'Jauge' },
    { code: WIDGET_TYPE.BAR, label: 'Bandes' },
    { code: WIDGET_TYPE.PIE, label: 'Circulaire' },
];

export enum FILTER_TYPE {
    EQUAL = "EQUAL",
    NOTEQUAL = "NOTEQUAL",
    GT = "GT",
    GE = "GE",
    LT = "LT",
    LE = "LE",
    BETWEEN = "BETWEEN",
    ISNULL = "ISNULL",
    ISNOTNULL = "ISNOTNULL",
    CONTAIN = "CONTAIN",
    BEGINWITH = "BEGINWITH"
}

export enum AGGREGATION_TYPE {
    MAX = "MAX",
    MIN = "MIN",
    SUM = "SUM",
    LISTUNIQUE = "LISTUNIQUE",
    COUNT = "COUNT",
    DISTINCTCOUNT = "DISTINCTCOUNT",
    AVG = "AVG"
}

export enum SORT {
    DESC = "DESC",
    ASC = "ASC",
}

export enum FORMATTING_TYPE {
    F1 = "31/05/2022",
    F11 = "31/05/2022 11:03",
    F12 = "31/05/2022 11:03:15",
    F2 = "31-05-2022",
    F21 = "31-05-2022 11:03",
    F22 = "31-05-2022 11:03:15",
    F3 = "31-Juil-2022",
    F4 = "Mar 31 Juil 2022",
}

