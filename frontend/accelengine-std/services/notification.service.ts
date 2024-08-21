import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { AEList } from 'accelengine-lib';
import { Notification } from '../models/notification.model';

// Services
import { CrudAPIService } from 'accelengine-lib';

import { APP_CONFIG } from '@app/app.config';

@Injectable({ providedIn: 'root' })
export class NotificationService extends CrudAPIService<Notification>{

  constructor(private injector: Injector) {
    super(injector);
    this.endpointService = APP_CONFIG.apiBaseUrl + '/notification';
  }

  findAllByAccount(idAccount: number): Observable<AEList<Notification>> {
    return this.http.get<AEList<Notification>>(`${this.endpointService}/findallbyaccount/${idAccount}`);
  }

  findAllByAccountPageable(idAccount: number, page: number, size: number): Observable<AEList<Notification>> {
    return this.http.get<AEList<Notification>>(`${this.endpointService}/findallbyaccountpageable/${idAccount}/${page}/${size}`);
  }

  findAllByAccountPageableNotSeen(idAccount: number, page: number, size: number): Observable<AEList<Notification>> {
    return this.http.get<AEList<Notification>>(`${this.endpointService}/findallbyaccountpageablenotseen/${idAccount}/${page}/${size}`);
  }

  markAsSeen(notification: Notification, idNotification: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.endpointService}/markasseen/${idNotification}`, notification);
  }

  numberOfNotSeenNotificationsByAccount(idAccount: number): Observable<number> {
    return this.http.get<number>(`${this.endpointService}/numberofnotseennotificationsbyaccount/${idAccount}`);
  }

  markAllAsSeenByAccount(idAccount: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.endpointService}/markallasseenbyaccount/${idAccount}`);
  }
}
