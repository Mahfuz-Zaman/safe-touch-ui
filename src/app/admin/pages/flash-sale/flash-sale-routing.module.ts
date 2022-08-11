import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FlashSaleComponent} from './flash-sale.component';
import {AddNewFlashSaleComponent} from './add-new-flash-sale/add-new-flash-sale.component';

const routes: Routes = [
  {path: '', component: FlashSaleComponent},
  {path: 'add-new-flash-sale', component: AddNewFlashSaleComponent},
  {path: 'edit-flash-sale/:id', component: AddNewFlashSaleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlashSaleRoutingModule { }
