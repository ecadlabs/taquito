import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbButtonModule, NbIconModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkSelectModule } from './components/network-select/network-select.module';
import { NetworkSelectService } from './components/network-select/network-select.service';
import { TaquitoService } from './taquito.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot(),
    BrowserAnimationsModule,
    NbLayoutModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbIconModule,
    RouterModule,
    NetworkSelectModule,
  ],
  providers: [TaquitoService, NetworkSelectService],
  bootstrap: [AppComponent],
})
export class AppModule {}
