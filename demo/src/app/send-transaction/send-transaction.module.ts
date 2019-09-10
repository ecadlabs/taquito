import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendTransactionComponent } from './send-transaction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbInputModule, NbButtonModule, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { TxCardComponent } from './tx-card/tx-card.component';



@NgModule({
  declarations: [SendTransactionComponent, TxCardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule
  ],
  exports: [SendTransactionComponent]
})
export class SendTransactionModule { }
