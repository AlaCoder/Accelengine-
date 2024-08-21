import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Models

// Services
import { MainMenuService } from '../services/mainmenu.service';

import { APP_CONFIG } from '@app/app.config';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationMenuGuard implements CanActivate {

  constructor(private router: Router,
    private mainMenuService: MainMenuService,
    private storageService: StorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const self = this;
    return self.mainMenuService.checkAuthorizationMenu(state.url).pipe(tap((res: boolean) => {
      if (res === false) {
        self.router.navigate([APP_CONFIG.app.notFoundUrl]);
        return false;
      } else {
        return true;
      }
    }));
  }

}
