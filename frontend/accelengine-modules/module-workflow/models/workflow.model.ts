import { Role } from "@app/accelengine-core/models/account.model";
import { Document } from '@app/accelengine-std/models/application.model';
import { AEAuditingEntity, AEEntity, WorkflowStatus } from "accelengine-lib";

export class Workflow extends AEAuditingEntity {
    document: Document;
    initialStatus: WorkflowStatus;
    finalStatus: WorkflowStatus;
    transitions: WorkflowTransition[] = [];
    workflowStatuses: WorkflowStatus[] = [];
    name: string;
}

export class WorkflowTransition extends AEAuditingEntity {
    fromStatus: WorkflowStatus;
    toStatus: WorkflowStatus;
    roles: Role[];
    constraint: WorkflowDocumentConstraint;
    hooks: WorkflowHook[];
    automaticTransition: boolean;
    estimation: string;
    estimationInMilliseconds: number;
    commentIsRequired: boolean;
}

export class WorkflowDocumentConstraint extends AEAuditingEntity {
    name: string;
    document: Document;
    failureStatus: WorkflowStatus;
    constraints: WorkflowConstraint[] = [];
}

export class WorkflowConstraint extends AEAuditingEntity {
    operator: string;
    operation: string;
    filedName: string;
    filedType: FieldType;
    value: string;
    valueDate: Date;
    constraintOrder: number;
}

export enum FieldType {
    NUMBER = "NUMBER",
    DATE = "DATE",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN"
}

export const FIELD_TYPE_LIST: any = [
    { code: FieldType.NUMBER, label: "Entier" },
    { code: FieldType.DATE, label: "Date" },
    { code: FieldType.STRING, label: "Chaine" },
    { code: FieldType.BOOLEAN, label: "Boolean" },
];

export class WorkflowHook extends AEEntity {
    name: string;
    document: string;
    className: string;
    isAsync: boolean;
    isValidationBusinessRule: boolean;
}

export class ConstraintFieldDTO {
    name: string;
    type: FieldType;
}