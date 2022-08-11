import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductDetailsRoutingModule} from './product-details-routing.module';
import {ProductDetailsComponent} from './product-details.component';
import {MaterialModule} from '../../material/material.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductCardTwoModule} from '../../shared/lazy-component/product-card-two/product-card-two.module';
import {StarRatingModule} from '../../shared/lazy-component/star-rating/star-rating.module';
import {RatingAndReviewComponent} from './rating-and-review/rating-and-review.component';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ProductRatingViewModule} from 'src/app/shared/lazy-component/product-rating-view/product-rating-view.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';


@NgModule({
  declarations: [ProductDetailsComponent, RatingAndReviewComponent],
    imports: [
        CommonModule,
        ProductDetailsRoutingModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ProductCardTwoModule,
        StarRatingModule,
        ProductCardOneModule,
        PipesModule,
        ProductRatingViewModule,
        LazyLoadImageModule
    ]
})
export class ProductDetailsModule {
}
