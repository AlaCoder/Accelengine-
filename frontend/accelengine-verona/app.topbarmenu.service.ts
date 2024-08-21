import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class TopbarMenuService {

    private menuSource = new Subject<string>();
    private resetSource = new Subject();
    private bookmarkSource = new Subject();
    private selectedBookmarkSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();
    bookmark$ = this.bookmarkSource.asObservable();
    selectedBookmark$ = this.selectedBookmarkSource.asObservable();

    public selectedBookmark: string[] = [];


    constructor() {
        this.selectedBookmark$.subscribe((url: string) => {
            this.selectedBookmark.push(url);
        });
    }

    onMenuStateChange(key: string) {
        this.menuSource.next(key);
    }

    onBookmark() {
        this.bookmarkSource.next(true);
    }

    clearBookmark() {
        this.selectedBookmark = [];
    }

    selectBookmark(url: string) {
        this.selectedBookmarkSource.next(url);
    }

    isBookmark(url: string) {
        return this.selectedBookmark.indexOf(url) > -1
    }

    reset() {
        this.resetSource.next(void 0);
    }
}
