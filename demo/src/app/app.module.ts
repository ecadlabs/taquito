import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule } from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaquitoService } from './taquito.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NbThemeModule.forRoot(), BrowserAnimationsModule],
  providers: [TaquitoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
