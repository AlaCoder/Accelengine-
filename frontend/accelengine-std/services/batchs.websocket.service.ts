import { Injectable } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';

// Models
import { WebSocketOptions } from 'accelengine-lib';

// Services
import { WebSocketService } from 'accelengine-lib';


export const batchsStompConfig: InjectableRxStompConfig = {
    webSocketFactory: () => {
        return new WebSocket(APP_CONFIG.socketBaseUrl);
    }
};

@Injectable({ providedIn: 'root' })
export class BatchsWebsocketService extends WebSocketService {
    constructor(stompService: RxStompService) {
        super(
            stompService,
            batchsStompConfig,
            new WebSocketOptions(APP_CONFIG.app.prefixBatchSocket)
        );
    }
}