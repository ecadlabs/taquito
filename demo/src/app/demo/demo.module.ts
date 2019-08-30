import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { NbInputModule, NbCardModule, NbToggleModule } from '@nebular/theme';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DemoComponent],
  imports: [
    CommonModule,
    NbInputModule,
    NbCardModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    NbToggleModule
  ],
  exports: [DemoComponent]
})
export class DemoModule { }
