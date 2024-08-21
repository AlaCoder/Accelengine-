export class Column {
    id: number;
    field: string;
    header: string;
    type: ColumnType;
    format: string;
    filter: boolean;
    sort: boolean;
    filterValue: any;
    list: any;
    url: string;
    buttonLabel: string;
    buttonIcon: string;
    buttonClass: string;
    buttonLabel2: string;
    buttonIcon2: string;
    buttonClass2: string;
    isButton2: boolean;
    fieldArray: string;
    width: number;
    isEditable: boolean;
    // For editable dropdown
    isDropdown: boolean;
    dropdownValues: any[];
    dropdownDisplayField: string;
    dropdownKeyField: string;
    dropdownReturnValue: string;
    // For editable input number
    modeEditableNumber: string = "decimal";
    minFractionDigitsEditableNumber: number;
    minEditableNumber: number;
    maxEditableNumber: number;
    suffixEditableNumber: string;
    prefixEditableNumber: string;
    // Export
    export: boolean;
    // Style column
    styleColumn: Object;
    activateStyleColumn: boolean = false;
    // Transforms
    expressionPipeDecimal: string;

    static fromObject(element) {
        const col = new Column();
        col.field = element.field;
        col.header = element.header;
        col.type = element.type;
        col.format = element.format;
        col.filter = element.filter;
        col.sort = element.sort;
        col.list = element.list;
        col.url = element.url;
        col.buttonLabel = element.buttonLabel;
        col.buttonLabel2 = element.buttonLabel2;
        col.isEditable = element.isEditable;
        col.isButton2 = element.isButton2;
        col.isDropdown = element.isDropdown;
        col.dropdownValues = element.dropdownValues;
        col.dropdownDisplayField = element.dropdownDisplayField;
        col.dropdownKeyField = element.dropdownKeyField;
        col.dropdownReturnValue = element.dropdownReturnValue;
        col.modeEditableNumber = element.modeEditableNumber;
        col.minFractionDigitsEditableNumber = element.minFractionDigitsEditableNumber;
        col.minEditableNumber = element.minEditableNumber;
        col.maxEditableNumber = element.maxEditableNumber;
        col.prefixEditableNumber = element.prefixEditableNumber;
        col.suffixEditableNumber = element.suffixEditableNumber;
        col.export = element.export;
        col.styleColumn = element.styleColumn;
        col.activateStyleColumn = element.activateStyleColumn;
        col.expressionPipeDecimal = element.expressionPipeDecimal;

        if (element.buttonIcon)
            col.buttonIcon = element.buttonIcon;
        else
            col.buttonIcon = 'fa fa-eye fa-lg';

        if (element.buttonClass)
            col.buttonClass = element.buttonClass;
        else
            col.buttonClass = 'p-button-lg';

        if (element.buttonIcon2)
            col.buttonIcon2 = element.buttonIcon2;
        else
            col.buttonIcon2 = 'fa fa-eye fa-lg';

        if (element.buttonClass2)
            col.buttonClass2 = element.buttonClass2;
        else
            col.buttonClass2 = 'p-button-lg';

        col.fieldArray = element.fieldArray;

        if (element.width) {
            col.width = element.width;
        }
        // else {
        //     col.width = 50;
        // }
        if (element.isEditable === undefined) {
            col.isEditable = false;
        }
        if (element.dropdownValues === undefined && element.isEditable) {
            col.dropdownValues = [];
        }
        if (element.export === undefined) {
            col.export = true;
        }
        if (element.styleColumn === undefined) {
            col.styleColumn = {};
        }
        if (element.activateStyleColumn === undefined) {
            col.activateStyleColumn = false;
        }
        return col;
    }

    static fromObjects(elements: any) {
        const cols = [];
        for (const element of elements) {
            const castedElement = Column.fromObject(element);
            cols.push(castedElement);
        }
        return cols;
    }
}

export enum ColumnType {
    BOOLEAN,
    DATETIME,
    COLOR,
    NUMBER,
    STRING,
    FILE,
    BUTTON,
    LIST,
    STATUS
}