import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountComponent} from './account.component';
import {BasicInfoComponent} from './basic-info/basic-info.component';
import {AddressBookComponent} from './address-book/address-book.component';
import {OrderListComponent} from './order-list/order-list.component';
import {ReviewsComponent} from './reviews/reviews.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {OrderDetailsComponent} from './order-details/order-details.component';
import {WishlistComponent} from './wishlist/wishlist.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {path: '', redirectTo: 'basic-info'},
      {path: 'basic-info', component: BasicInfoComponent},
      {path: 'address', component: AddressBookComponent},
      {path: 'order-list', component: OrderListComponent},
      {path: 'order-details/:id', component: OrderDetailsComponent},
      {path: 'wishlist', component: WishlistComponent},
      {path: 'reviews', component: ReviewsComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'transactions', component: TransactionsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
