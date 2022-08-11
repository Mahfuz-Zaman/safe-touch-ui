import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SnackbarNotificationComponent} from './components/ui/snackbar-notification/snackbar-notification.component';
import {MessageDialogComponent} from './components/ui/message-dialog/message-dialog.component';
import {ConfirmDialogComponent} from './components/ui/confirm-dialog/confirm-dialog.component';
import {InfoDialogComponent} from './components/ui/info-dialog/info-dialog.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {LangTranslateModule} from '../core/lang-translate/lang-translate.module';
import {MaterialModule} from '../material/material.module';
import {RouterModule} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {OutSideClickDirective} from './directives/out-side-click.directive';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import {CartViewDialogComponent} from './components/cart-view-dialog/cart-view-dialog.component';
import {PipesModule} from './pipes/pipes.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FlexLayoutModule,
    LangTranslateModule,
    NgxSpinnerModule,
    MaterialModule,
    RouterModule,
    CarouselModule,
    PipesModule
  ],
  exports: [
    FlexLayoutModule,
    FlexLayoutServerModule,
    SnackbarNotificationComponent,
    MessageDialogComponent,
    LangTranslateModule,
    NgxSpinnerModule,
    FooterComponent,
    ProductCardComponent,
    CarouselModule,
    OutSideClickDirective,
    CartViewDialogComponent
  ],
  declarations: [
    SnackbarNotificationComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
    FooterComponent,
    ProductCardComponent,
    OutSideClickDirective,
    CartViewDialogComponent
  ],
  providers: [],
  entryComponents: []
})
export class SharedModule {
}
