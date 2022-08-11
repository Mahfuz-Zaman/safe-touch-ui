import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealOfDayCardComponent } from './deal-of-day-card.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    DealOfDayCardComponent
  ],
    imports: [
        CommonModule,
        RouterModule
    ],
  exports: [
    DealOfDayCardComponent
  ]
})
export class DealOfDayCardModule { }
