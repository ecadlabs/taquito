import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule, NbTabsetModule } from '@nebular/theme';
import { AceEditorModule } from 'ng2-ace-editor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

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
  ],
  exports: [NewContractComponent],
})
export class NewContractModule {}
