import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbSpinnerModule } from '@nebular/theme';

import { SignerSelectComponent } from './signer-select.component';

@NgModule({
  declarations: [SignerSelectComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NbButtonModule, NbSpinnerModule],
  exports: [SignerSelectComponent],
})
export class SignerSelectModule {}
