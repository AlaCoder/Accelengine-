import { AEAuditingEntity } from "accelengine-lib";
import { DictionaryType } from "./dictionaryType.model";

export class DictionaryValue extends AEAuditingEntity {
    code: string;
    label: string;
    codeLabel: string;
    description: string;
    type: DictionaryType;
    valString1?: string;
    valString2?: string;
    valString3?: string;
    valInt1?: number;
    valInt2?: number;
    valInt3?: number;
    valBool1?: boolean;
    valBool2?: boolean;
    valBool3?: boolean;
    valDate1?: Date;
    valDate2?: Date;
    valDate3?: Date;
}