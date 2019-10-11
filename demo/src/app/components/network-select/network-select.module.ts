import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';

import { NetworkSelectComponent } from './network-select.component';

@NgModule({
  declarations: [NetworkSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
  ],
  exports: [NetworkSelectComponent],
})
export class NetworkSelectModule {}
