import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrdersComponent} from './orders.component';
import {OrderDetailsComponent} from './order-details/order-details.component';

const routes: Routes = [
  {path: '', component: OrdersComponent},
  {path: ':id', component: OrdersComponent},
  {path: 'order-details/:id', component: OrderDetailsComponent},
  {path: 'order-details/:id/:vendorId', component: OrderDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
