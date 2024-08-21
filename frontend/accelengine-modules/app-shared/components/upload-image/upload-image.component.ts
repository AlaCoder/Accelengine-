import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AEFile } from '@app/accelengine-modules/module-ged/models/aefile.model';
//Components
import { FormComponent } from 'accelengine-lib';

//Models

//Services
import { FileService } from '@app/accelengine-modules/module-ged/services/file.service';

// Helpers
@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent extends FormComponent<AEFile> implements OnInit, OnChanges {
  @Input("idFile") idFile: number;
  urlImage: string = '';
  @Output() sendNewImage = new EventEmitter<File>();
  constructor(private injector: Injector, private fileService: FileService) {
    super(injector, AEFile);
    this.formGroup = this.formBuilder.group({
      id: [this.idFile],
      img: [null],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["idFile"] && changes["idFile"].currentValue) {
      this.idFile = changes["idFile"].currentValue
      this.urlImage = `${this.fileService.endpointService}/src/${this.idFile}`;
      console.log(this.urlImage)
    }
  }

  ngOnInit(): void {
  }
  OnchangePhoto(elem) {
    var reader = new FileReader();
    reader.readAsDataURL(this.f.img.value);
    reader.onload = (_event) => {
      this.urlImage = reader.result as string;
      this.sendNewImage.emit(this.f.img.value)
    };
  }
  onSaveClick() { }
}
