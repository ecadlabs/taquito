import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbTooltipModule,
} from '@nebular/theme';
import { AceEditorModule } from 'ng2-ace-editor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SignerSelectModule } from 'src/app/components/signer-select/signer-select.module';

import { NewContractComponent } from './new-contract.component';

@NgModule({
  declarations: [NewContractComponent],
  imports: [
    CommonModule,
    NbCardModule,
    MatProgressBarModule,
    NbTabsetModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    AceEditorModule,
    NbSpinnerModule,
    NbAlertModule,
    NbIconModule,
    NbTooltipModule,
    RouterModule,
    SignerSelectModule,
  ],
  exports: [NewContractComponent],
})
export class NewContractModule {}
