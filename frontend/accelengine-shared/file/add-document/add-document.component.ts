import { Component, OnInit, Injector, Input } from "@angular/core";

//Models
import { AEFile } from "@app/accelengine-modules/module-ged/models/aefile.model";

//Services

//Component
import { FormPopupComponent } from "accelengine-lib";
//Helpers

@Component({
    selector: "app-add-document",
    templateUrl: "./add-document.component.html",
    styleUrls: ["./add-document.component.scss"],
})
export class AddDocumentComponent extends FormPopupComponent<AEFile> implements OnInit {

    allowedType: string = 'application/pdf,.doc,.docx';

    constructor(injector: Injector) {
        super(injector, AEFile);
        this.allowedType = this.param;
        this.formGroup = this.formBuilder.group({
            file: [null],
        });
    }

    ngOnInit(): void { }
}
