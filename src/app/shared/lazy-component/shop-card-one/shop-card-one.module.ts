import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopCardOneComponent } from './shop-card-one.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {OnlineShopListRoutingModule} from '../../../pages/online-shop-list/online-shop-list-routing.module';



@NgModule({
    declarations: [
        ShopCardOneComponent
    ],
    exports: [
        ShopCardOneComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        OnlineShopListRoutingModule
    ]
})
export class ShopCardOneModule { }