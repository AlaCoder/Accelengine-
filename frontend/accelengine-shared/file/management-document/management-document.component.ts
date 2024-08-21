import { Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

// Components
import { AddDocumentComponent } from '@app/accelengine-shared/file/add-document/add-document.component';
import { DetailComponent } from "accelengine-lib";

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { AEFile } from '@app/accelengine-modules/module-ged/models/aefile.model';

// Services
import { FileService } from '@app/accelengine-modules/module-ged/services/file.service';

// Helpers
import { Logger } from "accelengine-lib";
import { remove } from 'lodash';
import { APP_CONFIG } from '@app/app.config';

const log = new Logger("ManagementDocumentComponent");
@Component({
    selector: 'app-management-document',
    templateUrl: './management-document.component.html',
    styleUrls: ['./management-document.component.scss']
})
export class ManagementDocumentComponent extends DetailComponent<AEFile> implements OnChanges {

    @Input() documents: AEFile[] = [];
    @Input() allowedType: string = "";
    @Input() allowedSize: number;
    @Input() maxFiles: number = -1;
    @Input() isEdit: boolean;
    @Output() selectDocuments = new EventEmitter<AEFile[]>();

    isAddDisabled: boolean = true;
    idDocument: number = 0;
    columnsChild: any;

    constructor(injector: Injector, private fileService: FileService) {
        super(injector, AEFile, fileService);

        this.columnsChild = Column.fromObjects([
            { field: "name", header: "Nom", filter: true, sort: true },
            { field: "size", header: "Taille", filter: true, sort: true },
            { field: "id", header: "Télécharger", type: ColumnType.FILE, url: APP_CONFIG.apiBaseUrl + "/file/src" }
        ]);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.updateTypesMenuCrud();
    }

    updateTypesMenuCrud() {
        if ((this.maxFiles !== -1 && this.documents && this.documents.length >= this.maxFiles) || !this.isEdit) {
            this.isAddDisabled = true;
        } else {
            this.isAddDisabled = false;
        }
    }

    onAddChildClick() {
        log.debug("Add Child Click");
        const self = this;
        self.addChild(AddDocumentComponent, this.translateService.instant('Ajouter un document'), this.allowedType).subscribe((result) => {
            if (result.file) {
                this.subscriptions.push(this.fileService.uploadDocument(result.file, this.allowedType, this.allowedSize).subscribe((document: AEFile) => {
                    if (document) {
                        if (!this.documents)
                            this.documents = [];
                        this.documents.push(document);
                        this.selectDocuments.emit(this.documents);
                        this.updateTypesMenuCrud();
                    }
                }));
            }
        });
    }

    onDeleteDocumentClick(event): void {
        const self = this;
        self.deleteChild().pipe().subscribe((document) => {
            if (document) {
                remove(this.documents, document);
                this.selectDocuments.emit(this.documents);
                this.updateTypesMenuCrud();
            }
        });
    }

    onDblclickChildRow(row) {
        log.info('onDblclickChildRow');
        this.selectedChildData = row;
        this.canDeleteCopyChild = true;
    }

    onSaveClick() { }
}
