import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbThemeModule, NbActionsModule, NbLayoutModule, NbTabsetModule, } from '@nebular/theme';
import { DemoModule } from './demo/demo.module';
import { TezosService } from './tezos.service';
import { MatProgressBarModule } from '@angular/material';
import { NetworkSelectorModule } from './network-selector/network-selector.module';
import { SendTransactionModule } from './send-transaction/send-transaction.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot(),
    NbActionsModule,
    NbLayoutModule,
    DemoModule,
    BrowserAnimationsModule,
    NbTabsetModule,
    MatProgressBarModule,
    NetworkSelectorModule,
    SendTransactionModule
  ],
  providers: [TezosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
