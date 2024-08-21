import { AEAuditingEntity } from 'accelengine-lib';
import { CTable } from './table.model';

export class CDatasource extends AEAuditingEntity {
    type: string;
    host: string;
    port: number;
    databaseName: string;
    databaseUser: string;
    databasePassword: string;
    tables: CTable[];
}



