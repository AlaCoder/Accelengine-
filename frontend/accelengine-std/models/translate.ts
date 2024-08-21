import { AEAuditingEntity } from "accelengine-lib";

export class AETranslate extends AEAuditingEntity {
    language: string;
    codeModule: string;
    message: string;
}