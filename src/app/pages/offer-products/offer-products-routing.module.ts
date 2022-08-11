import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OfferProductsComponent} from './offer-products.component';

const routes: Routes = [
  {path: ':id', component: OfferProductsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferProductsRoutingModule { }
