import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkSelectorComponent } from './network-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';



@NgModule({
  declarations: [NetworkSelectorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbSelectModule
  ],
  exports: [NetworkSelectorComponent]
})
export class NetworkSelectorModule { }
