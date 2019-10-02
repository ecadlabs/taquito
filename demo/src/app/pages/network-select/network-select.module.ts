import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NetworkSelectComponent } from './network-select.component';

@NgModule({
  declarations: [NetworkSelectComponent],
  imports: [CommonModule, RouterModule],
  exports: [NetworkSelectComponent],
})
export class NetworkSelectModule {}
