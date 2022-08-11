import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardOneComponent} from './product-card-one.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../../../material/material.module';
import {QuickViewDialogComponent} from './quick-view-dialog/quick-view-dialog.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {PipesModule} from '../../pipes/pipes.module';
import { ProductRatingViewModule } from '../product-rating-view/product-rating-view.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';


@NgModule({
  declarations: [
    ProductCardOneComponent,
    QuickViewDialogComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        CarouselModule,
        PipesModule,
        ProductRatingViewModule,
        LazyLoadImageModule,
    ],
  exports: [
    ProductCardOneComponent
  ],
})
export class ProductCardOneModule {
}
