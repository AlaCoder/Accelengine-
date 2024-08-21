import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AEFile } from '@app/accelengine-modules/module-ged/models/aefile.model';
//Components
import { FormComponent } from 'accelengine-lib';

//Models

//Services
import { FileService } from '@app/accelengine-modules/module-ged/services/file.service';

// Helpers
@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent extends FormComponent<AEFile> implements OnInit, OnChanges {

  @Input() isDisabled: boolean;
  @Input() idFile: number;
  @Input() allowedType = 'image/*, application/pdf,.doc,.docx';
  @Output() selectDocument = new EventEmitter<File>();

  urlImage: string = '';

  constructor(private injector: Injector, private fileService: FileService) {
    super(injector, AEFile);
    this.formGroup = this.formBuilder.group({
      id: [this.idFile],
      img: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idFile'] && changes['idFile'].currentValue) {
      this.idFile = changes['idFile'].currentValue
      this.urlImage = `${this.fileService.endpointService}/src/${this.idFile}`;
    }
    if (changes['allowedType'] && changes['allowedType'].currentValue) {
      this.allowedType = changes['allowedType'].currentValue;
    }
  }

  ngOnInit(): void {
  }

  onChangeImage() {
    var reader = new FileReader();
    reader.readAsDataURL(this.f.img.value);
    reader.onload = (_event) => {
      this.urlImage = reader.result as string;
      this.selectDocument.emit(this.f.img.value)
    };
  }

  onSaveClick() { }
}
