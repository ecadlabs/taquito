import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbInputModule, NbSelectModule } from '@nebular/theme';

import { SearchFormComponent } from './search-form.component';

@NgModule({
  declarations: [SearchFormComponent],
  imports: [CommonModule, ReactiveFormsModule, NbSelectModule, NbInputModule, NbButtonModule],
  exports: [SearchFormComponent],
})
export class SearchFormModule {}
