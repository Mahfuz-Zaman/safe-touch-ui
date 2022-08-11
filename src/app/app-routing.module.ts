import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {AdminAuthGuard} from './auth-guard/admin-auth.guard';
import {AdminAuthStateGuard} from './auth-guard/admin-auth-state.guard';
import {CustomPreloadingStrategy} from './core/utils/preloading-strategy';
import {VendorAuthStateGuard} from './auth-guard/vendor-auth-state.guard';
import {VendorAuthGuard} from './auth-guard/vendor-auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  // ADMIN
  {
    path: environment.adminLoginUrl,
    canActivate: [AdminAuthStateGuard],
    loadChildren: () => import('./admin/admin-auth/admin-auth.module').then(m => m.AdminAuthModule)
  },
  {
    path: environment.vendorLoginUrl,
    canActivate: [VendorAuthStateGuard],
    loadChildren: () => import('./vendor/vendor-auth/vendor-auth.module').then(m => m.VendorAuthModule)
  },
  {
    path: environment.vendorBaseUrl,
    canActivate: [VendorAuthGuard],
    loadChildren: () => import('./vendor/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: environment.adminBaseUrl,
    canActivate: [AdminAuthGuard],
    loadChildren: () => import('./admin/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./vendor/pages/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: CustomPreloadingStrategy,
    relativeLinkResolution: 'legacy',
    // initialNavigation: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy, AdminAuthGuard, AdminAuthStateGuard, VendorAuthGuard, VendorAuthStateGuard]
})
export class AppRoutingModule {
}
