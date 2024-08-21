import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Helpers
//import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class CriteriaSubmitService {
    
    public criteriaSubmit: Subject<any> = new Subject();

    constructor() { }
}