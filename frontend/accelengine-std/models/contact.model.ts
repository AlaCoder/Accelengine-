import { AEEntity } from 'accelengine-lib';

export class Contact extends AEEntity {
    mainAddress: string;
    mainPhone: number;
    address1: string;
    address2: string;
    address3: string;
    phone1: number;
    phone2: number;
    phone3: number;
    fax1: number;
    fax2: number;
    fax3: number;
    email1: string;
    email2: string;
    email3: string;
    postalCode: string;
    city: string;
    country: string;
    mainPhoneString: string;
    phone1String: string;
    phone2String: string;
    phone3String: string;
    fax1String: string;
    fax2String: string;
    fax3String: string;
}