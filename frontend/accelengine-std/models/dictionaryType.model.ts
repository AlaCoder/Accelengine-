import { AEEntity } from 'accelengine-lib';
import { DictionaryValue } from './dictionaryValue.model';

export class DictionaryType extends AEEntity {
	code: string;
	label: string;
	codeLabel: string;
	description: string;
	dictionaryValues: DictionaryValue[] = [];
	otherValues: boolean;
	valString1Label: string;
	valString2Label: string;
	valString3Label: string;
	valInt1Label: string;
	valInt2Label: string;
	valInt3Label: string;
	valBool1Label: string;
	valBool2Label: string;
	valBool3Label: string;
	valDate1Label: string;
	valDate2Label: string;
	valDate3Label: string;
}