export class FC_FLOWCHART {
    operators: FC_OPERATOR[] = [];
    links: FC_LINK[] = [];
}

export class FC_OPERATOR {
    top: number;
    left: number;
    properties: FC_PROPERTIE;
}

export class FC_PROPERTIE {
    title: string;
    class: string;
    inputs: Map<string, FC_IO> = new Map();
    outputs: Map<string, FC_IO> = new Map();

}

export class FC_IO {
    label: string;
    multiple: boolean;
}

export class FC_LINK {
    fromOperator: string;
    fromConnector: string;
    fromSubConnector: number;
    toOperator: string;
    toConnector: string;
    toSubConnector: number;
}
