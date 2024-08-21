import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

// Models

// Services

import { ChangeNotSaved } from 'accelengine-lib';

@Injectable({ providedIn: 'root' })
export class ChangeNotSavedGuard implements CanDeactivate<ChangeNotSaved> {
  canDeactivate(
    component: ChangeNotSaved,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (typeof component.changeNotSaved === "function") {
      return component.changeNotSaved();
    } else
      return true;
  }
}
