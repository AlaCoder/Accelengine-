import { Account } from '@core/models/account.model';
import { AEAuditingEntity } from 'accelengine-lib';

export class AEFile extends AEAuditingEntity {
    name: string;
    type: string;
    absolutePath: string;
    size: number;
    shared: boolean;
    account: Account;
    file?:File;
}