import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardTwoComponent } from './product-card-two.component';
import {RouterModule} from '@angular/router';



@NgModule({
    declarations: [
        ProductCardTwoComponent
    ],
    exports: [
        ProductCardTwoComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class ProductCardTwoModule { }
