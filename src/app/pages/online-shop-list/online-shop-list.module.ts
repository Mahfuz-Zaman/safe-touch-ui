import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineShopListRoutingModule } from './online-shop-list-routing.module';
import { OnlineShopListComponent } from './online-shop-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ShopCardOneModule} from '../../shared/lazy-component/shop-card-one/shop-card-one.module';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { OnlineShopDetailsComponent } from './online-shop-details/online-shop-details.component';
import {ProductCardTwoModule} from '../../shared/lazy-component/product-card-two/product-card-two.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';


@NgModule({
  declarations: [
    OnlineShopListComponent,
    OnlineShopDetailsComponent
  ],
    imports: [
        CommonModule,
        OnlineShopListRoutingModule,
        NgxPaginationModule,
        ShopCardOneModule,
        MaterialModule,
        FlexLayoutModule,
        ProductCardTwoModule,
        ProductCardOneModule,
    ]
})
export class OnlineShopListModule { }
