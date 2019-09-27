import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbButtonModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkSelectModule } from './components/network-select/network-select.module';
import { SearchFormModule } from './components/search-form/search-form.module';
import { TaquitoService } from './taquito.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot(),
    NbLayoutModule,
    BrowserAnimationsModule,
    NetworkSelectModule,
    SearchFormModule,
    NbButtonModule,
  ],
  providers: [TaquitoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
