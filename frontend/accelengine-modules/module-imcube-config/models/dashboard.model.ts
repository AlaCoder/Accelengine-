import { Role } from '@app/accelengine-core/models/account.model';
import { AEEntity, AEAuditingEntity } from 'accelengine-lib';
import { CWidget } from './widget.model';

export class CDashboard extends AEAuditingEntity {
    description: string;
    rows: CDashboardRow[] = [];
    roles: Role[] = [];
    period: boolean;
    dateField: string;
}

export class CDashboardRow extends AEEntity {
    structure: string;
    columns: CDashboardCol[] = [];
    height: number;
    calculatedHeight?: number;
}

export class CDashboardCol extends AEEntity {
    width: number;
    widget: CWidget;
}


export const STRUCTURE_TYPE_LIST: any[] = [
    { code: '12', label: '12' },
    { code: '6-6', label: '6 - 6' },
    { code: '4-8', label: '4 - 8' },
    { code: '8-4', label: '8 - 4' },
    { code: '2-10', label: '2 - 10' },
    { code: '10-2', label: '10 - 2' },
    { code: '4-4-4', label: '4 - 4 - 4' },
    { code: '3-6-3', label: '3 - 6 - 3' },
    { code: '3-3-3-3', label: '3 - 3 - 3 - 3' },
];