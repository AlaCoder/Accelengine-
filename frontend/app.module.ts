import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

// Module
import { CoreModule } from './accelengine-core/core.module';
import { VeronaModule } from './accelengine-verona/verona.module';
import { AppInitializationModule } from './app-initialization.module';
import { UtilitiesModule } from './accelengine-core/utilities/utilities.module';

// Component
import { AppComponent } from './accelengine-verona/app.component';

// Pages

// Services

// LOCALE
import { registerLocaleData } from '@angular/common';
import localeTn from '@angular/common/locales/ar-TN';
import localeUS from '@angular/common/locales/es-US';
registerLocaleData(localeTn);
registerLocaleData(localeUS);

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        // App custom dependencies
        UtilitiesModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppInitializationModule,
        CoreModule,
        VeronaModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor() {
    }
}
