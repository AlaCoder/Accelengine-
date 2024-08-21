/*
 * CORE "version": "2.0.0"
 */
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { UtilitiesModule } from './utilities/utilities.module';

// Guards
import { AuthorizationMenuGuard } from './guards/authorization-menu.guard';

// Websocket
import { RxStompService } from '@stomp/ng2-stompjs';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Components

// Services

// Interceptors
import { HttpCallInterceptorProvider } from './services/http.call.interceptor';

import { APP_CONFIG } from '@app/app.config';

@NgModule({
  imports: [
    UtilitiesModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [

  ],
  entryComponents: [
  ],
  providers: [
    AuthorizationMenuGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    HttpCallInterceptorProvider,
    RxStompService,
    // CORE
  ]
})

export class CoreModule {
  constructor() { }
}

// required for AOT compilation
export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, APP_CONFIG.apiBaseUrl + '/translate/i18n/', '');
}