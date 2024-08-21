import { Document } from "@app/accelengine-std/models/application.model";
import { AEAuditingEntity } from "accelengine-lib";
import { AEStatus } from "./aestatus.model";

export class AEStatusType extends AEAuditingEntity {
    code: string;
    name: string;
    document: Document
    isPriority: boolean;
    statuses: AEStatus[] = [];
}
