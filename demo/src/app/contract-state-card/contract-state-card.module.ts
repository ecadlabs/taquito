import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ContractStateCardComponent } from './contract-state-card.component';

@NgModule({
  declarations: [ContractStateCardComponent],
  imports: [CommonModule, NbCardModule],
  exports: [ContractStateCardComponent],
})
export class ContractStateCardModule {}
