import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material';
import { NbCardModule, NbTabsetModule } from '@nebular/theme';

import { TzPipe } from '../tz.pipe';
import { ContractStateCardComponent } from './contract-state-card.component';

@NgModule({
  declarations: [ContractStateCardComponent, TzPipe],
  imports: [CommonModule, NbCardModule, MatProgressBarModule, NbTabsetModule],
  exports: [ContractStateCardComponent],
})
export class ContractStateCardModule {}
