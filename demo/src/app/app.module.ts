import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbActionsModule,
  NbButtonModule,
  NbInputModule,
  NbLayoutModule,
  NbTabsetModule,
  NbThemeModule,
} from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContractStateCardModule } from './contract-state-card/contract-state-card.module';
import { DemoModule } from './demo/demo.module';
import { SearchFormModule } from './search-form/search-form.module';
import { TaquitoService } from './taquito.service';
import { TezosService } from './tezos.service';

@NgModule({
  declarations: [AppComponent],
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
    NbInputModule,
    NbButtonModule,
    SearchFormModule,
    ContractStateCardModule,
  ],
  providers: [TezosService, TaquitoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
