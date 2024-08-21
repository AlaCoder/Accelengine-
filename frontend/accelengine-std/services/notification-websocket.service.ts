import { Injectable } from '@angular/core';

import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { WebSocketOptions, WebSocketService } from 'accelengine-lib';

// Services
import { RxStompService } from '@stomp/ng2-stompjs';

import { APP_CONFIG } from '@app/app.config';
import { Subject } from 'rxjs';
import { Notification } from '../models/notification.model';

export const notificationsStompConfig: InjectableRxStompConfig = {
  webSocketFactory: () => {
    return new WebSocket(APP_CONFIG.socketBaseUrl);
  }
};

@Injectable({ providedIn: 'root' })
export class NotificationWebsocketService extends WebSocketService {

  public data: Subject<Notification> = new Subject<Notification>();

  constructor(stompService: RxStompService) {
    super(
      stompService,
      notificationsStompConfig,
      new WebSocketOptions(APP_CONFIG.app.prefixNotificationsSocket)
    );
  }

  playAudio() {
    let audio = new Audio();
    audio.src = APP_CONFIG.applicationUrlRedirect + "assets/audio/notification.mp3";
    if (audio.src) {
      audio.load();
      audio.play().then(() => {
        // Audio is playing.
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

}
