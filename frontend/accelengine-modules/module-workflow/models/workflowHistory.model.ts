import { Account } from "@app/accelengine-core/models/account.model";
import { AEWorkflow } from "accelengine-lib";

export class WorkflowHistory {
	date: Date;
	fromStatus: string;
	toStatus: string;
	description: string;
	duration: number;
	workflow: AEWorkflow;
	executor: Account;
}
