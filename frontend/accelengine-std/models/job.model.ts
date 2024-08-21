import { AEAuditingEntity } from 'accelengine-lib';

export class Job extends AEAuditingEntity {
    name: string;
    groupName: string;
    className: string;
    cronExpression: string;
    repeatTime: number;
    cron: boolean;
}


