import { HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { Observable } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { CrudAPIService } from 'accelengine-lib';

@Injectable({
  providedIn: 'root'
})
export class FileExplorerService extends CrudAPIService<any> {

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/file-explorer';
  }

  getTreeByPath(path: string): Observable<TreeNode> {
    return this.http.post<TreeNode>(`${this.endpointService}/gettreebypath`, { path: path });
  }

  downloadFile(path: string): Observable<any> {
    const url = `${this.endpointService}/download`;
    const req = new HttpRequest('POST', url, { path: path }, {
      responseType: "blob"
    });
    return this.http.request(req);
  }

}
