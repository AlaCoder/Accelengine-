import { AEAuditingEntity } from "accelengine-lib";

export class AEStatus extends AEAuditingEntity {
    code: string;
    label: string;
    color: string;
    priorityLevel: number;
}
