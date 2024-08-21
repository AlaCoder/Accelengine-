import { AEAuditingEntity } from 'accelengine-lib';

export class Email extends AEAuditingEntity {
	fromEmail: String;
	fromName: String;
	toEmail: String;;
	cc: String;
	subject: String;;
	body: String;
	attachments: String[] = [];
	date: Date;
	causeOfFailure: String;
	emailStatus: EMAIL_STATUS;
}
export class Child extends AEAuditingEntity {
	name: string;
}
export enum EMAIL_STATUS {
	SUCCESS = "SUCCESS",
	FAILURE = "FAILURE",
}

export const EMAIL_STATUS_LIST: any = [
	{ code: EMAIL_STATUS.SUCCESS, label: "Envoyé avec succès " },
	{ code: EMAIL_STATUS.FAILURE, label: "Echec d'envoi" },

];