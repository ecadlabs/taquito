import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { NbInputModule, NbCardModule, NbToggleModule, NbSelectModule, NbTabsetModule } from '@nebular/theme';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material'
// import { ChartsModule } from 'ng2-charts';
import { ChartModule } from 'angular-highcharts';
import { TzPipe } from './tz.pipe';


@NgModule({
  declarations: [DemoComponent, TzPipe],
  imports: [
    CommonModule,
    NbInputModule,
    NbCardModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    NbToggleModule,
    ChartModule
  ],
  exports: [DemoComponent]
})
export class DemoModule { }
