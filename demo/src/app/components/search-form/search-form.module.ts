import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbInputModule } from '@nebular/theme';

import { SearchFormComponent } from './search-form.component';

@NgModule({
  declarations: [SearchFormComponent],
  imports: [CommonModule, ReactiveFormsModule, NbInputModule, NbButtonModule, FormsModule],
  exports: [SearchFormComponent],
})
export class SearchFormModule {}
