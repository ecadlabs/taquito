import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbLayoutModule, NbTabsetModule } from '@nebular/theme';
import { NetworkSelectModule } from 'src/app/components/network-select/network-select.module';
import { SearchFormModule } from 'src/app/components/search-form/search-form.module';

import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    SearchFormModule,
    NbButtonModule,
    NetworkSelectModule,
    NbTabsetModule,
  ],
  exports: [DemoComponent],
})
export class DemoModule {}
