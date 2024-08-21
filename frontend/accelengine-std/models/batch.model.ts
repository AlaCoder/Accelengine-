import { AEEntity } from 'accelengine-lib';

export class Batch extends AEEntity {
    name: string;
    description: string;
}

export class BatchExecution extends AEEntity {
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    batchParameter: BatchParameter;
    fileLogPath: string;
    fileErrorPath: string;
    outputFilePath: string;
}


export class BatchParameter extends AEEntity {
    parameters: Map<string, string> = new Map<string, string>();
}

export const BATCH_STATUS_LIST: any = [
    { code: 'STARTING', label: 'Annulé' },
    { code: 'STARTED', label: 'Annulé' },
    { code: 'INPROGRESS', label: 'En cours' },
    { code: 'FINISHED', label: 'Terminé' },
    { code: 'STOPED', label: 'Suspendu' },
    { code: 'FAILED', label: 'Annulé' },
    { code: 'COMPLETED', label: 'Terminé' }
];