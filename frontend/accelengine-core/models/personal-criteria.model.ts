import { AECriteria, AEEntity } from 'accelengine-lib';
import { Account } from './account.model';

export class PersonalCriteria extends AEEntity {
    codeMenu: string;
    account: Account;
    criteria: AECriteria;
}