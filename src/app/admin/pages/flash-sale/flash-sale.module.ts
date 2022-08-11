import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlashSaleRoutingModule } from './flash-sale-routing.module';
import { FlashSaleComponent } from './flash-sale.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {AddNewFlashSaleComponent} from './add-new-flash-sale/add-new-flash-sale.component';


@NgModule({
  declarations: [
    FlashSaleComponent,
    AddNewFlashSaleComponent
  ],
    imports: [
        CommonModule,
        FlashSaleRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexModule,
        FormsModule,
        PipesModule
    ]
})
export class FlashSaleModule { }
