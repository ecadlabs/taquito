import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material';
import { NbAlertModule, NbCardModule, NbSpinnerModule, NbTabsetModule } from '@nebular/theme';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { ContractStateComponent } from './contract-state.component';

@NgModule({
  declarations: [ContractStateComponent],
  imports: [
    CommonModule,
    NbCardModule,
    MatProgressBarModule,
    NbTabsetModule,
    NbSpinnerModule,
    NgxJsonViewerModule,
    NbAlertModule,
  ],
  exports: [ContractStateComponent],
})
export class ContractStateModule {}
