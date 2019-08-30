import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbThemeModule, NbActionsModule, NbLayoutModule, } from '@nebular/theme';
import { DemoModule } from './demo/demo.module';
import { TezosService } from './tezos.service';


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
    BrowserAnimationsModule
  ],
  providers: [TezosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
