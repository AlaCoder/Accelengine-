import { AEEntity, AEAuditingEntity, CodeNameEntity } from 'accelengine-lib';
import { DictionaryValue } from './dictionaryValue.model';

export class Application extends AEEntity {
    code: string;
    name: string;
    description: string;
    version: string;
    modules: Module[];
    publicKey: string;
    databaseName: string;
    databaseVersion: string;
    databaseURL: string;
    driverName: string;
    driverVersion: string;
    expirationDate: Date;
    machineId: string;
    activateMultitenancy: boolean;
    activateMaintenance: boolean;
}

export class Module extends AEEntity {
    name: string;
    version: string;
    type: MODULE_TYPE;
    stringLicense: string;
    settings: Setting[] = [];
    expired: boolean;
}


export enum MODULE_TYPE {
    MODSTD = "MODSTD",
    MODAPP = "MODAPP",
    MODCLI = "MODCLI"
}

export const MODULE_TYPE_LIST: any = [
    { code: MODULE_TYPE.MODSTD, label: "Module STD" },
    { code: MODULE_TYPE.MODAPP, label: "Module applicatif" },
    { code: MODULE_TYPE.MODCLI, label: "Module client" },
];

export class Setting extends AEAuditingEntity {
    name: string;
    type: VALUE_TYPE;
    valueString: string;
    valueNumber: number;
    valueBoolean: boolean;
    displayOrder: number;
    module: string;
    criterias: string;
}

export enum VALUE_TYPE {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN"
}

export const VALUE_TYPE_LIST: any = [
    { code: VALUE_TYPE.STRING, label: "String" },
    { code: VALUE_TYPE.NUMBER, label: "Number" },
    { code: VALUE_TYPE.BOOLEAN, label: "Boolean" },
];


export class Document extends CodeNameEntity {
    history: boolean;
}

export class Action extends CodeNameEntity {
}

export enum ACTION_TYPE {
    READ = "READ",
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    ALL = "ALL"
}

export class AEActionHistory extends AEEntity {
    entityId: number;
    entityName: string;
    type: ACTION_TYPE;
    by: string;
    actionDate: Date;
}
