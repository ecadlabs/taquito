import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule, NbTabsetModule } from '@nebular/theme';
import { SearchFormModule } from 'src/app/components/search-form/search-form.module';

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    SearchFormModule,
    NbButtonModule,
    NbTabsetModule,
    NbCardModule,
    NbIconModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
