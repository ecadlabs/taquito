import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule],
  exports: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
