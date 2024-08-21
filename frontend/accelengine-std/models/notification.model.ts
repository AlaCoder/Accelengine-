import { Account } from '@app/accelengine-core/models/account.model';
import { AEAuditingEntity } from 'accelengine-lib';

export class Notification extends AEAuditingEntity{

    title:string;
    description:string;
    dateTime: Date;
    typeNotification:TypeNotification;
    link: string;
    seen: boolean;
    dateTimeSeen: Date;
    receiver: Account;
    roomReceiver: string;
    idData: number;
}

export enum TypeNotification{

    INFORMATION="INFORMATION",
    WARNING="WARNING",
    ERROR="ERROR",
    SUCCESS="SUCCESS",
    OTHER="OTHER"
    
}
