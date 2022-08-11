import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {UserAuthStateGuard} from '../auth-guard/user-auth-state.guard';
import {UserAuthGuard} from '../auth-guard/user-auth.guard';
import {TestComponent} from './test/test.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'product-list',
        loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'all-product-list',
        loadChildren: () => import('./all-product-list/all-product-list.module').then(m => m.AllProductListModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'product-details/:slug',
        loadChildren: () => import('./product-details/product-details.module').then(m => m.ProductDetailsModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'offers',
        loadChildren: () => import('./offer-view/offer-view.module').then(m => m.OfferViewModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'deal-on-play',
        loadChildren: () => import('./deal-on-play/deal-on-play.module').then(m => m.DealOnPlayModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'offer-products',
        loadChildren: () => import('./offer-products/offer-products.module').then(m => m.OfferProductsModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'registration',
        canActivate: [UserAuthStateGuard],
        loadChildren: () => import('./user/registration/registration.module').then(m => m.RegistrationModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'login',
        canActivate: [UserAuthStateGuard],
        loadChildren: () => import('./user/login/login.module').then(m => m.LoginModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'password-recovery',
        loadChildren: () => import('./password-recovery/password-recovery.module').then(m => m.PasswordRecoveryModule),
        data: {preload: false, delay: true}
      },
      {
        path: 'account',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./user/account/account.module').then(m => m.AccountModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'cart',
        loadChildren: () => import('./user/cart/cart.module').then(m => m.CartModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'checkout',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./user/checkout/checkout.module').then(m => m.CheckoutModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'store-locator',
        loadChildren: () => import('./store-locator/store-locator.module').then(m => m.StoreLocatorModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'top-brands',
        loadChildren: () => import('./top-brands/top-brands.module').then(m => m.TopBrandsModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'sell-on-rajarhat',
        loadChildren: () => import('./sell-on/sell-on.module').then(m => m.SellOnModule),
        data: {preload: true, delay: false}
      },
      {
        path: 'pages',
        loadChildren: () => import('./additional-page-view/additional-page-view.module').then(m => m.AdditionalPageViewModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
        data: {preload: false, delay: true}
      },
      {
        path: 'online-shop',
        loadChildren: () => import('./online-shop-list/online-shop-list.module').then(m => m.OnlineShopListModule),
        data: {preload: false, delay: true}
      },
      {
        path: 'coming-soon',
        loadChildren: () => import('./coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
        data: {preload: false, delay: true}
      },
      {
        path: 'vendor-registration',
        loadChildren: () => import('./vendor-registration/vendor-registration.module').then(m => m.VendorRegistrationModule),
        data: {preload: false, delay: true}
      },
      {path: 'test', component: TestComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UserAuthGuard, UserAuthStateGuard]
})
export class PagesRoutingModule {
}
