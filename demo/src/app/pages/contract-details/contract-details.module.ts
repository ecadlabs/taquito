import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbCardModule, NbIconModule, NbSpinnerModule, NbTabsetModule, NbTooltipModule } from '@nebular/theme';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SearchFormModule } from 'src/app/components/search-form/search-form.module';

import { ContractDetailsComponent } from './contract-details.component';

@NgModule({
  declarations: [ContractDetailsComponent],
  imports: [
    CommonModule,
    NbCardModule,
    SearchFormModule,
    NbTabsetModule,
    NbSpinnerModule,
    NgxJsonViewerModule,
    NbIconModule,
    NbTooltipModule,
    RouterModule,
  ],
  exports: [ContractDetailsComponent],
})
export class ContractDetailsModule {}
