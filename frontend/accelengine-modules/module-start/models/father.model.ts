import { DictionaryValue } from '@app/accelengine-std/models/dictionaryValue.model';
import { AEAuditingEntity, AEWorkflow } from 'accelengine-lib';
import { AEFile } from '@app/accelengine-modules/module-ged/models/aefile.model';
import { AEStatus } from '@app/accelengine-std/models/aestatus.model';
import { DictionaryType } from '@app/accelengine-std/models/dictionaryType.model';
import { Setting } from '@app/accelengine-std/models/application.model';

export class Father extends AEWorkflow {
	string1: string;
	string2: string;
	string3: string;
	string4: FATHER_TYPE;
	string5: string[];
	string6: string;
	string7: string;
	number1: number;
	number2: number;
	number3: number;
	number4: number;
	boolean1: boolean;
	date1: Date;
	specialitie: DictionaryValue;
	specialities: DictionaryValue[] = [];
	childs: Child[] = [];
	responses: Response[];
	documents: AEFile[] = [];
	image: AEFile;
	priority: AEStatus;
	statusFather: AEStatus;
	dynamicType: string;
	dictionaryType1: DictionaryType;
	dictionaryType2: DictionaryType;
	setting: Setting;
	number5: number;
}

export enum FATHER_TYPE {
	TYPE1 = "TYPE1",
	TYPE2 = "TYPE2",
	TYPE3 = "TYPE3"
}

export const FATHER_TYPE_LIST: any = [
	{ code: FATHER_TYPE.TYPE1, label: 'TYPE 1' },
	{ code: FATHER_TYPE.TYPE2, label: 'TYPE 2' },
	{ code: FATHER_TYPE.TYPE3, label: 'TYPE 3' }]


export class Child extends AEAuditingEntity {
	name: string;
}