import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


// Models
import { TableDTO } from '../models/table.model';

// Services
import { APP_CONFIG } from '@app/app.config';
import { AEList } from 'accelengine-lib';
import { CWidget } from '../models/widget.model';

@Injectable()
export class CubeDataLoaderService {
    endpointService: string = APP_CONFIG.apiBaseUrl + '/imcube/config/dataloader';

    constructor(private http: HttpClient) {
    }

    getAllTables(): Observable<AEList<TableDTO>> {
        return this.http.get<AEList<TableDTO>>(`${this.endpointService}/tables`);
    }

    getAllDatasourceTables(): Observable<AEList<TableDTO>> {
        return this.http.get<AEList<TableDTO>>(`${this.endpointService}/datasourcetables`);
    }

    loadTable(tableID: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.endpointService}/load/${tableID}`);
    }

    destroyTable(tableID: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.endpointService}/destroy/${tableID}`);
    }

    backupTable(tableID: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.endpointService}/backup/${tableID}`);
    }

    backups(tableName: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.endpointService}/backups/${tableName}`);
    }

    loadBackupTable(tableName: string, fileName: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.endpointService}/loadbackup/${tableName}/${fileName}`);
    }

    destroyMetadata(metadataName: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.endpointService}/destroymetadata/${metadataName}`);
    }

    distinctvalues(tableID: number, colName: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.endpointService}/distinctvalues/${tableID}/${colName}`);
    }
}