import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbActionsModule, NbButtonModule, NbInputModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContractStateCardModule } from './contract-state-card/contract-state-card.module';
import { SearchFormModule } from './search-form/search-form.module';
import { TaquitoService } from './taquito.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot(),
    NbActionsModule,
    NbLayoutModule,
    BrowserAnimationsModule,
    NbInputModule,
    NbButtonModule,
    SearchFormModule,
    ContractStateCardModule,
  ],
  providers: [TaquitoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
