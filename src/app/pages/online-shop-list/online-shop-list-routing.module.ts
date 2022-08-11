import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OnlineShopListComponent} from './online-shop-list.component';
import {OnlineShopDetailsComponent} from './online-shop-details/online-shop-details.component';

const routes: Routes = [
  {path: '', component: OnlineShopListComponent},
  {path: 'details/:slug', component: OnlineShopDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineShopListRoutingModule { }
