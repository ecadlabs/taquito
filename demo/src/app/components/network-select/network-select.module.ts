import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';

import { NetworkSelectComponent } from './network-select.component';

@NgModule({
  declarations: [NetworkSelectComponent],
  imports: [CommonModule, ReactiveFormsModule, NbSelectModule],
  exports: [NetworkSelectComponent],
})
export class NetworkSelectModule {}
