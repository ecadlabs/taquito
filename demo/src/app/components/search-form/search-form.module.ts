import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';

import { SearchFormComponent } from './search-form.component';

@NgModule({
  declarations: [SearchFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
  ],
  exports: [SearchFormComponent],
})
export class SearchFormModule {}
