import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class NavigationUrlService {

  private currentUrlSubject: BehaviorSubject<string>;
  public currentUrl$: Observable<string>;

  private previousUrlSubject: BehaviorSubject<string>;
  public previousUrl$: Observable<string>;

  constructor(private storageService: StorageService) {
    let previousUrlFromStorage: string = localStorage.getItem(StorageService.PREVIOUS_URL) ? JSON.parse(localStorage.getItem(StorageService.PREVIOUS_URL)) : null;
    this.previousUrlSubject = new BehaviorSubject<any>(previousUrlFromStorage);
    this.previousUrl$ = this.previousUrlSubject.asObservable();
    this.currentUrlSubject = new BehaviorSubject<string>(null);
    this.currentUrl$ = this.currentUrlSubject.asObservable();
  }

  setCurrentUrl(currentUrl: string) {
    this.currentUrlSubject.next(currentUrl);
  }

  getCurrentUrl(): string {
    return this.currentUrlSubject.value;
  }

  setPreviousUrl(previousUrl: string) {
    if (this.getPreviousUrl() && !previousUrl) {
      return;
    }
    this.previousUrlSubject.next(previousUrl);
    this.storageService.set(StorageService.PREVIOUS_URL, previousUrl);
  }

  getPreviousUrl(): string {
    return this.previousUrlSubject.value;
  }

}
