import { AEFile } from '@app/accelengine-modules/module-ged/models/aefile.model';
import { AEEntity} from 'accelengine-lib';
import { Contact } from './contact.model';
export class Company extends AEEntity {
    socialReason: string;
    siren: string;
    tva: string;
    legalForm: string;
    rcs: string;
    workforce: number;
    contact: Contact = new Contact();
    webSiteURL: string;
    currency: string;
    activity: string;
    logo: AEFile;
}
