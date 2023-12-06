/* eslint-disable @typescript-eslint/no-explicit-any */

import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnalyticsService } from './services/analytics.service';
import { CloudSaveService } from './services/cloud-save.service';
import { MetaService } from './services/meta.service';

import { isInElectron } from './helpers/electron';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as Stores from '../stores';
import * as Migrations from '../stores/migrations';
import { SuikaModule } from './pages/suika/suika.module';
import { DebugService } from './services/debug.service';

const allStores = Object.keys(Stores)
  .filter((x) => x.includes('State'))
  .map((x) => (Stores as Record<string, any>)[x]);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxWebstorageModule.forRoot(),
    NgxTippyModule,
    NgxsModule.forRoot(allStores, {
      developmentMode: !isDevMode() && !isInElectron(),
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !isDevMode(),
      filter: (action) => !action.constructor.name.includes('Timer'),
    }),
    NgxsStoragePluginModule.forRoot({
      key: allStores,
      migrations: Object.values(Migrations).flat(),
      storage: StorageOption.LocalStorage,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    SuikaModule,
    NgbModule,
  ],
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [DebugService, CloudSaveService, MetaService, AnalyticsService],
      useFactory:
        (
          debugService: DebugService,
          cloudSaveService: CloudSaveService,
          metaService: MetaService,
          analyticsService: AnalyticsService,
        ) =>
        async () => {
          await debugService.init();
          await cloudSaveService.init();
          await metaService.init();
          await analyticsService.init();
        },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
