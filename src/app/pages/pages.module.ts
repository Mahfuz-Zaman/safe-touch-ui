import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {MenuModule} from '../core/menu/menu.module';
import {TestComponent} from './test/test.component';
import {CarouselModule} from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [PagesComponent, TestComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MenuModule,
    CarouselModule,
  ]
})
export class PagesModule {
}
