import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductListComponent} from './product-list.component';

const routes: Routes = [
  {path: '', component: ProductListComponent},
  {path: ':categorySlug', component: ProductListComponent},
  {path: ':categorySlug/:subCategorySlug', component: ProductListComponent},
  {path: ':categorySlug/:subCategorySlug/:brandSlug', component: ProductListComponent},
  {path: 'rajarhat/:r', component: ProductListComponent},
  {path: 'vendor/:vendorId', component: ProductListComponent},
  {path: 'my-test', component: ProductListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductListRoutingModule { }
