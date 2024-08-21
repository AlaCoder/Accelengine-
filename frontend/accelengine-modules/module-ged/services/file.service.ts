import { Injectable, Injector } from '@angular/core';

// Models
import { AEFile } from '../models/aefile.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService extends CrudAPIService<AEFile>{

    constructor(
        private injector: Injector) {
        super(injector);
        this.endpointService = APP_CONFIG.apiBaseUrl + '/file';
    }

    uploadFile(file: File, isPrivate: boolean): Observable<any> {
        const formData: FormData = new FormData();
        formData.append("file", file);
        formData.append("shared", isPrivate + "");
        const url = `${this.endpointService}/resources/upload`;
        return this.http.post<any>(url, formData);
    }

    uploadMultipleFiles(files: File[], allowedType: string, allowedSize: number): Observable<AEFile[]> {
        let formData: FormData = new FormData();
        formData.append("allowedType", allowedType);
        formData.append("allowedSize", allowedSize + "");
        files.forEach((file, index) => {
            formData.append("files", file);
        })
        const url = `${APP_CONFIG.apiBaseUrl}/masterdata/node/resources/upload/documents`;
        return this.http.post<any>(url, formData);
    }

    createAEFileFromExistingFile(nameFile: string): Observable<AEFile> {
        return this.http.post<AEFile>(`${this.endpointService}/createaefile/${nameFile}`, []);
    }

    uploadDocument(file: File, allowedType: string, allowedSize: number): Observable<AEFile> {
        const formData: FormData = new FormData();
        formData.append("file", file);
        formData.append("allowedType", allowedType);
        formData.append("allowedSize", allowedSize + "");
        const url = `${this.endpointService}/resources/upload/document`;
        return this.http.post<any>(url, formData);
    }
}