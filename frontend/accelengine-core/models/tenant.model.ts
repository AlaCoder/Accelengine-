import { AEEntity } from 'accelengine-lib';

export class Tenant extends AEEntity {
    name: string;
    parentTenant: Tenant;
    path: string;
    codeName?: string;
    children: Tenant[] = [];
}