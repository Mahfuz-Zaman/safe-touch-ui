import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddressPipe} from './address.pipe';
import {PricePipe} from './price.pipe';
import {SafeHtmlCustomPipe} from './safe-html.pipe';
import {SortPipe} from './sort.pipe';
import {RoleModifyPipe} from './role-modify.pipe';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {SlugToNormalPipe} from './slug-to-normal.pipe';
import {OrderStatusPipe} from './order-status.pipe';



@NgModule({
  declarations: [
    AddressPipe,
    PricePipe,
    SafeHtmlCustomPipe,
    SortPipe,
    RoleModifyPipe,
    NumberMinDigitPipe,
    SlugToNormalPipe,
    OrderStatusPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddressPipe,
    PricePipe,
    SafeHtmlCustomPipe,
    SortPipe,
    RoleModifyPipe,
    NumberMinDigitPipe,
    SlugToNormalPipe,
    OrderStatusPipe
  ]
})
export class PipesModule { }
