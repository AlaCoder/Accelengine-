import { Action, Setting } from '@std/models/application.model';
import { Contact } from '@std/models/contact.model';
import { Menu } from './menu.model';
import { AEEntity, AEAuditingEntity } from 'accelengine-lib';
import { TreeNode } from 'primeng/api';
import { Tenant } from './tenant.model';

export class Account extends AEAuditingEntity {
    username: string;
    password: string;
    newPassword: string;
    email: string;
    profile: Profile = new Profile();
    roles: Role[] = [];
    token?: string;
    info: string;
    code: string;
    type: string;
    contact: Contact = new Contact();
    settings: Setting[] = [];
    supervisorAccount: Account;
    affectedTenants: Tenant[] = [];
    redirectMenu: Menu;
}

export class AccountConfig {
    language: string;
    colorScheme: string;
    theme: string;
    layoutColor: string;
}

export class Profile extends AEEntity {
    civility: string;
    firstname: string;
    lastname: string;
    phone: string;
    fullname: string;
}

export const CIVILITY: any = [
    { code: 'M', label: 'MR' },
    { code: 'F', label: 'MS' },
];

export class Role extends AEEntity {
    code: string;
    name: string;
    permissions: Permission[] = [];
    menus: Menu[] = [];
    isSupervisor: boolean;
}

export class Permission extends AEEntity {
    document: Document;
    action: Action;
}

export class AEAccountHistory extends AEEntity {
    username: string;
    ip: string;
    info: string;
    loginDate: Date;
    logoutDate: Date;
}

export class AccountChildrenTreeDTO {
    accountChildren: Account[];
    accountTee?: TreeNode[];
}

export class AccountDataDTO {
    id: number;
    label: string;
    children: AccountDataDTO[] = [];
}
