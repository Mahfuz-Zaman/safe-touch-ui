import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferProductsComponent } from './offer-products.component';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../material/material.module';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProductCardTwoModule} from '../../shared/lazy-component/product-card-two/product-card-two.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {OfferProductsRoutingModule} from './offer-products-routing.module';


@NgModule({
  declarations: [
    OfferProductsComponent
  ],
  imports: [
    CommonModule,
    OfferProductsRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    ProductCardTwoModule,
    ProductCardOneModule,
  ]
})
export class OfferProductsModule { }
