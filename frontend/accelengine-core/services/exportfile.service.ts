import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Models

// Services

// Helper

@Injectable({ providedIn: 'root' })
export class ExportFileService {

    public exportPdf: Subject<boolean> = new Subject();
    public exportExcel: Subject<boolean> = new Subject();
    public exportCSV: Subject<boolean> = new Subject();

    constructor() {
    }

}
